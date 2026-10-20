/**
 * 007 — Exceptions, IDisposable, using
 * Run: dotnet run --project 007_exceptions_dispose
 */
using DemoLog;

DemoConsole.Title("007 | Exceptions & IDisposable");

DemoConsole.Section("1) try / catch / finally");
try
{
    throw new InvalidOperationException("demo failure");
}
catch (InvalidOperationException ex)
{
    DemoConsole.Step("caught", ex.Message);
}
finally
{
    DemoConsole.Ok("finally always runs (cleanup / logging hooks)");
}

DemoConsole.Section("2) Exception filters");
try
{
    throw new ArgumentException("bad arg", "name");
}
catch (ArgumentException ex) when (ex.ParamName == "name")
{
    DemoConsole.Step("filtered catch ParamName", ex.ParamName);
}

DemoConsole.Section("3) IDisposable + using");
using (var resource = new FakeDbConnection("orders"))
{
    resource.Query("SELECT 1");
}
DemoConsole.Note("'await using' works with IAsyncDisposable for async cleanup.");

DemoConsole.Section("4) AggregateException (parallel/task)");
try
{
    Task.WaitAll(
        Task.FromException(new Exception("one")),
        Task.FromException(new Exception("two")));
}
catch (AggregateException ag)
{
    foreach (var inner in ag.InnerExceptions)
        DemoConsole.Step("inner", inner.Message);
}

DemoConsole.Ok("Prefer specific exceptions, don't swallow blindly, and dispose unmanaged/scarce resources.");

sealed class FakeDbConnection(string name) : IDisposable
{
    private bool _disposed;

    public void Query(string sql)
    {
        ObjectDisposedException.ThrowIf(_disposed, this);
        DemoConsole.Step($"{name}.Query", sql);
    }

    public void Dispose()
    {
        if (_disposed) return;
        _disposed = true;
        DemoConsole.Step($"{name}.Dispose", "released");
    }
}
