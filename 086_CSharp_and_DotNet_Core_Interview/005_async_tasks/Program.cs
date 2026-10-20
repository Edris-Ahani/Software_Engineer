/**
 * 005 — async / await / Task
 * Run: dotnet run --project 005_async_tasks
 */
using DemoLog;

DemoConsole.Title("005 | Async, Task & await");

await DemoAsync();

static async Task DemoAsync()
{
    DemoConsole.Section("1) Sequential awaits (serial)");
    var t0 = DateTime.UtcNow;
    await FakeIoAsync("A", 80);
    await FakeIoAsync("B", 80);
    DemoConsole.Step("serial elapsed ms", (DateTime.UtcNow - t0).TotalMilliseconds);

    DemoConsole.Section("2) Concurrent start + Task.WhenAll");
    t0 = DateTime.UtcNow;
    var ta = FakeIoAsync("A", 80);
    var tb = FakeIoAsync("B", 80);
    await Task.WhenAll(ta, tb);
    DemoConsole.Step("parallel elapsed ms", (DateTime.UtcNow - t0).TotalMilliseconds);
    DemoConsole.Ok("Start both tasks before awaiting to overlap I/O.");

    DemoConsole.Section("3) Task.WhenAny / cancellation");
    using var cts = new CancellationTokenSource(TimeSpan.FromMilliseconds(50));
    try
    {
        await FakeIoAsync("slow", 200, cts.Token);
    }
    catch (OperationCanceledException)
    {
        DemoConsole.Warn("Operation canceled via CancellationToken");
    }

    var winner = await Task.WhenAny(FakeIoAsync("fast", 30), FakeIoAsync("slow", 200));
    DemoConsole.Step("WhenAny winner", await winner);

    DemoConsole.Section("4) ConfigureAwait note");
    await Task.Delay(10).ConfigureAwait(false);
    DemoConsole.Note("In libraries, ConfigureAwait(false) avoids capturing a sync context (less relevant in ASP.NET Core).");
    DemoConsole.Ok("async methods return Task/Task<T>; exceptions become faulted tasks.");
}

static async Task<string> FakeIoAsync(string name, int ms, CancellationToken ct = default)
{
    await Task.Delay(ms, ct);
    DemoConsole.Step("completed", name);
    return name;
}
