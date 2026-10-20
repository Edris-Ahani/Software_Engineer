/**
 * 009 — ASP.NET Core hosting & middleware pipeline
 * Run: dotnet run --project 009_aspnet_core_pipeline
 */
using DemoLog;

DemoConsole.Title("009 | ASP.NET Core Pipeline");

const string url = "http://127.0.0.1:5109";
var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls(url);
builder.Logging.ClearProviders();

var app = builder.Build();

app.Use(async (ctx, next) =>
{
    ctx.Response.Headers["X-Demo"] = "middleware-1";
    DemoConsole.Step("MW1 before", ctx.Request.Path);
    await next();
    DemoConsole.Step("MW1 after", ctx.Response.StatusCode);
});

app.Use(async (ctx, next) =>
{
    DemoConsole.Step("MW2 before", ctx.Request.Method);
    await next();
});

app.MapGet("/ping", () => Results.Ok(new { ok = true, layer = "endpoint" }));
app.MapGet("/fail", () => Results.Problem("demo error", statusCode: 500));

await app.StartAsync();
DemoConsole.Section("1) Request through middleware → endpoint");

using var client = new HttpClient { BaseAddress = new Uri(url) };
var ping = await client.GetAsync("/ping");
var body = await ping.Content.ReadAsStringAsync();
DemoConsole.Step("status", (int)ping.StatusCode);
DemoConsole.Step("X-Demo header", ping.Headers.GetValues("X-Demo").FirstOrDefault());
DemoConsole.Step("body", body);

DemoConsole.Section("2) Order matters");
DemoConsole.Ok("Middleware runs in registration order on the way in, reverse order on the way out.");
DemoConsole.Note("Exception-handling middleware should be registered early to wrap the pipeline.");

await app.StopAsync();
