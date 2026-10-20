/**
 * 008 — Threading, Parallel, concurrent collections
 * Run: dotnet run --project 008_threading_parallel
 */
using System.Collections.Concurrent;
using DemoLog;

DemoConsole.Title("008 | Threading & Parallelism");

DemoConsole.Section("1) ThreadPool work item");
var done = new ManualResetEventSlim(false);
ThreadPool.QueueUserWorkItem(_ =>
{
    DemoConsole.Step("ThreadPool thread", Environment.CurrentManagedThreadId);
    done.Set();
});
done.Wait();

DemoConsole.Section("2) lock vs Interlocked");
int counter = 0;
var gate = new object();
Parallel.For(0, 1000, _ =>
{
    lock (gate) { counter++; }
});
DemoConsole.Step("lock counter", counter);

int atomic = 0;
Parallel.For(0, 1000, _ => Interlocked.Increment(ref atomic));
DemoConsole.Step("Interlocked counter", atomic);

DemoConsole.Section("3) ConcurrentDictionary");
var map = new ConcurrentDictionary<string, int>();
Parallel.For(0, 100, i => map.AddOrUpdate("hits", 1, (_, old) => old + 1));
DemoConsole.Step("hits", map["hits"]);

DemoConsole.Section("4) Parallel.ForEach vs async");
var sw = System.Diagnostics.Stopwatch.StartNew();
Parallel.ForEach(Enumerable.Range(1, 4), n => Thread.Sleep(50));
sw.Stop();
DemoConsole.Step("Parallel.ForEach ~50ms x4 wall", $"{sw.ElapsedMilliseconds}ms");
DemoConsole.Warn("Parallel.* is for CPU-bound work; use async/await for I/O-bound work.");
DemoConsole.Ok("Choose sync primitives carefully to avoid deadlocks and race conditions.");
