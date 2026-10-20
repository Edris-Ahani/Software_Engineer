/**
 * 016 — Advanced: IHostedService, Channel, CancellationToken
 * Run: dotnet run --project 016_advanced_hosting
 */
using System.Threading.Channels;
using DemoLog;

DemoConsole.Title("016 | Advanced Hosting Combos");

const string url = "http://127.0.0.1:5116";
var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls(url);
builder.Logging.ClearProviders();

builder.Services.AddSingleton(Channel.CreateUnbounded<string>());
builder.Services.AddHostedService<QueueWorker>();
builder.Services.AddSingleton<WorkQueue>();

var app = builder.Build();

app.MapPost("/enqueue", async (EnqueueRequest req, WorkQueue queue, CancellationToken ct) =>
{
    await queue.EnqueueAsync(req.Message, ct);
    return Results.Accepted(value: new { queued = req.Message });
});

app.MapGet("/processed", (WorkQueue queue) => Results.Ok(queue.ProcessedSnapshot()));

await app.StartAsync();
using var client = new HttpClient { BaseAddress = new Uri(url) };

DemoConsole.Section("1) BackgroundService drains a Channel");
await client.PostAsJsonAsync("/enqueue", new EnqueueRequest("job-1"));
await client.PostAsJsonAsync("/enqueue", new EnqueueRequest("job-2"));
await Task.Delay(200);
DemoConsole.Step("GET /processed", await client.GetStringAsync("/processed"));

DemoConsole.Section("2) Interview takeaways");
DemoConsole.Ok("IHostedService/BackgroundService = long-running work inside the host.");
DemoConsole.Ok("Channel<T> = high-performance in-process producer/consumer queue.");
DemoConsole.Ok("Always honor CancellationToken for graceful shutdown.");

await app.StopAsync();

record EnqueueRequest(string Message);

sealed class WorkQueue(Channel<string> channel)
{
    private readonly List<string> _processed = [];
    private readonly object _gate = new();

    public ValueTask EnqueueAsync(string message, CancellationToken ct) =>
        channel.Writer.WriteAsync(message, ct);

    public void MarkProcessed(string message)
    {
        lock (_gate) _processed.Add(message);
    }

    public string[] ProcessedSnapshot()
    {
        lock (_gate) return _processed.ToArray();
    }
}

sealed class QueueWorker(Channel<string> channel, WorkQueue queue, ILogger<QueueWorker> logger)
    : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await foreach (var message in channel.Reader.ReadAllAsync(stoppingToken))
        {
            logger.LogInformation("Processing {Message}", message);
            queue.MarkProcessed(message);
            DemoConsole.Step("worker processed", message);
        }
    }
}
