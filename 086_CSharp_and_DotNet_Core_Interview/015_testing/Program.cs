/**
 * 015 — Testability with DI (unit + in-process host)
 * Run: dotnet run --project 015_testing
 */
using DemoLog;

DemoConsole.Title("015 | Testing Patterns");

DemoConsole.Section("1) Pure unit test of a service (no host)");
IPricingService pricing = new PricingService();
var total = pricing.Calculate(unitPrice: 10, quantity: 3, discountPercent: 10);
AssertEqual(27m, total, "discounted total");
DemoConsole.Ok("Unit tests target logic with fakes/mocks — fast and isolated.");

DemoConsole.Section("2) Integration-style: in-process host + replaced service");
const string url = "http://127.0.0.1:5115";
var builder = WebApplication.CreateBuilder();
builder.WebHost.UseUrls(url);
builder.Logging.ClearProviders();
builder.Services.AddSingleton<IPricingService>(new FakePricingService(99m));
var app = builder.Build();
app.MapGet("/price", (decimal unit, int qty, decimal discount, IPricingService svc) =>
    Results.Ok(new { total = svc.Calculate(unit, qty, discount) }));

await app.StartAsync();
using var client = new HttpClient { BaseAddress = new Uri(url) };
var json = await client.GetStringAsync("/price?unit=10&qty=2&discount=0");
DemoConsole.Step("GET /price with fake", json);
await app.StopAsync();
DemoConsole.Ok("Boot the pipeline in-process and override providers — same idea as WebApplicationFactory.");

DemoConsole.Section("3) What interviewers expect");
DemoConsole.Step("Unit", "class + mocked deps (xUnit/NUnit/MSTest)");
DemoConsole.Step("Integration", "WebApplicationFactory / TestServer");
DemoConsole.Step("E2E", "real HTTP against deployed/staging env");

static void AssertEqual<T>(T expected, T actual, string name)
{
    if (!Equals(expected, actual))
        throw new InvalidOperationException($"{name}: expected {expected}, got {actual}");
    DemoConsole.Step("PASS", $"{name} == {actual}");
}

interface IPricingService
{
    decimal Calculate(decimal unitPrice, int quantity, decimal discountPercent);
}

sealed class PricingService : IPricingService
{
    public decimal Calculate(decimal unitPrice, int quantity, decimal discountPercent)
    {
        var raw = unitPrice * quantity;
        return raw - raw * (discountPercent / 100m);
    }
}

sealed class FakePricingService(decimal fixedTotal) : IPricingService
{
    public decimal Calculate(decimal unitPrice, int quantity, decimal discountPercent) => fixedTotal;
}
