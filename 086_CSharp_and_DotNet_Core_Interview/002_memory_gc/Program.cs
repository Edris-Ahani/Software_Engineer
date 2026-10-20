/**
 * 002 — Memory model & Garbage Collection
 * Run: dotnet run --project 002_memory_gc
 */
using DemoLog;

DemoConsole.Title("002 | Memory & Garbage Collection");

DemoConsole.Section("1) Stack vs heap (conceptual demo)");
int valueOnStack = 42;
var refOnHeap = new Box(valueOnStack);
DemoConsole.Step("value type local", valueOnStack);
DemoConsole.Step("reference type on heap", refOnHeap.Value);
DemoConsole.Note("Value types often live on the stack (or inline); reference types allocate on the managed heap.");

DemoConsole.Section("2) Generational GC snapshot");
DemoConsole.Step("Gen0 collections", GC.CollectionCount(0));
DemoConsole.Step("Gen1 collections", GC.CollectionCount(1));
DemoConsole.Step("Gen2 collections", GC.CollectionCount(2));
long before = GC.GetTotalMemory(forceFullCollection: false);
var keepAlive = new byte[1024 * 256];
long afterAlloc = GC.GetTotalMemory(forceFullCollection: false);
DemoConsole.Step("Heap before", before);
DemoConsole.Step("Heap after ~256KB alloc", afterAlloc);
GC.KeepAlive(keepAlive);

DemoConsole.Section("3) Forced collection (demo only — avoid in hot paths)");
keepAlive = null!;
GC.Collect();
GC.WaitForPendingFinalizers();
long afterGc = GC.GetTotalMemory(forceFullCollection: true);
DemoConsole.Step("Heap after GC.Collect", afterGc);
DemoConsole.Warn("Do not call GC.Collect in production code unless you have a measured reason.");

DemoConsole.Section("4) Finalizer vs IDisposable");
DemoConsole.Ok("Prefer IDisposable/using for deterministic cleanup; finalizers are a last-resort safety net.");

sealed class Box(int value)
{
    public int Value { get; } = value;
}
