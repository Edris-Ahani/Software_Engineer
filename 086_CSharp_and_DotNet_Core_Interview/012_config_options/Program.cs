/**
 * 012 — Configuration & Options pattern
 * Run: dotnet run --project 012_config_options
 */
using DemoLog;
using Microsoft.Extensions.Options;

DemoConsole.Title("012 | Configuration & Options");

const string url = "http://127.0.0.1:5112";
var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    ContentRootPath = AppContext.BaseDirectory,
});
builder.WebHost.UseUrls(url);
builder.Logging.ClearProviders();

builder.Configuration.AddInMemoryCollection(new Dictionary<string, string?>
{
    ["App:Name"] = "InterviewDemo",
    ["App:MaxItems"] = "25",
    ["App:FeatureX"] = "true",
});

builder.Services
    .AddOptions<AppOptions>()
    .Bind(builder.Configuration.GetSection("App"))
    .Validate(o => o.MaxItems > 0, "MaxItems must be > 0")
    .ValidateOnStart();

var app = builder.Build();

app.MapGet("/config", (IOptions<AppOptions> options, IConfiguration config) => new
{
    options = options.Value,
    rawFeatureX = config["App:FeatureX"],
});

await app.StartAsync();
using var client = new HttpClient { BaseAddress = new Uri(url) };

DemoConsole.Section("1) IOptions snapshot");
DemoConsole.Step("GET /config", await client.GetStringAsync("/config"));

DemoConsole.Section("2) Interview notes");
DemoConsole.Ok("IOptions: singleton snapshot at resolve time.");
DemoConsole.Ok("IOptionsSnapshot: per-scope, supports reload.");
DemoConsole.Ok("IOptionsMonitor: change notifications for long-lived services.");

await app.StopAsync();

sealed class AppOptions
{
    public string Name { get; set; } = "";
    public int MaxItems { get; set; }
    public bool FeatureX { get; set; }
}
