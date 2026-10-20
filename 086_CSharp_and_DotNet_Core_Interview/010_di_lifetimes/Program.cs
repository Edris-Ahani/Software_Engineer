/**
 * 010 — Dependency Injection lifetimes
 * Run: dotnet run --project 010_di_lifetimes
 */
using DemoLog;

DemoConsole.Title("010 | DI Lifetimes (Singleton / Scoped / Transient)");

const string url = "http://127.0.0.1:5110";
var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls(url);
builder.Logging.ClearProviders();

builder.Services.AddSingleton<SingletonStamp>();
builder.Services.AddScoped<ScopedStamp>();
builder.Services.AddTransient<TransientStamp>();
builder.Services.AddTransient<StampReporter>();

var app = builder.Build();

app.MapGet("/stamps", (StampReporter reporter) => reporter.Snapshot());

await app.StartAsync();
using var client = new HttpClient { BaseAddress = new Uri(url) };

DemoConsole.Section("1) Two HTTP requests");
var r1 = await client.GetStringAsync("/stamps");
var r2 = await client.GetStringAsync("/stamps");
DemoConsole.Step("request 1", r1);
DemoConsole.Step("request 2", r2);

DemoConsole.Section("2) Rules of thumb");
DemoConsole.Ok("Singleton: one instance per process — never capture Scoped dependencies.");
DemoConsole.Ok("Scoped: one instance per request/scope — ideal for DbContext.");
DemoConsole.Ok("Transient: new instance every resolve.");

await app.StopAsync();

sealed class SingletonStamp
{
    public string Id { get; } = Guid.NewGuid().ToString("N")[..6];
}

sealed class ScopedStamp
{
    public string Id { get; } = Guid.NewGuid().ToString("N")[..6];
}

sealed class TransientStamp
{
    public string Id { get; } = Guid.NewGuid().ToString("N")[..6];
}

sealed class StampReporter(
    SingletonStamp singleton,
    ScopedStamp scoped,
    TransientStamp transientA,
    TransientStamp transientB)
{
    public object Snapshot() => new
    {
        singleton = singleton.Id,
        scoped = scoped.Id,
        transientA = transientA.Id,
        transientB = transientB.Id,
        note = "Same request: scoped equal; transientA != transientB. Across requests: singleton stable, scoped changes."
    };
}
