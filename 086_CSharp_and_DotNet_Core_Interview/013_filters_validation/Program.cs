/**
 * 013 — Filters, model binding, validation
 * Run: dotnet run --project 013_filters_validation
 */
using System.ComponentModel.DataAnnotations;
using DemoLog;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

DemoConsole.Title("013 | Filters & Validation");

const string url = "http://127.0.0.1:5113";
var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls(url);
builder.Logging.ClearProviders();
builder.Services.AddControllers(options =>
{
    options.Filters.Add<TimingActionFilter>();
});

var app = builder.Build();
app.MapControllers();

await app.StartAsync();
using var client = new HttpClient { BaseAddress = new Uri(url) };

DemoConsole.Section("1) Valid POST");
var ok = await client.PostAsJsonAsync("/api/orders", new CreateOrderDto { Customer = "Ada", Quantity = 2 });
DemoConsole.Step("status", (int)ok.StatusCode);
DemoConsole.Step("body", await ok.Content.ReadAsStringAsync());
DemoConsole.Step("X-Action-Ms", ok.Headers.TryGetValues("X-Action-Ms", out var ms) ? ms.First() : "-");

DemoConsole.Section("2) Invalid POST (model validation)");
var bad = await client.PostAsJsonAsync("/api/orders", new CreateOrderDto { Customer = "", Quantity = 0 });
DemoConsole.Step("status", (int)bad.StatusCode);
DemoConsole.Step("body", await bad.Content.ReadAsStringAsync());

DemoConsole.Ok("Action filters wrap controller actions; [ApiController] auto-returns 400 for invalid models.");

await app.StopAsync();

public sealed class CreateOrderDto
{
    [Required, MinLength(2)]
    public string Customer { get; set; } = "";

    [Range(1, 100)]
    public int Quantity { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public sealed class OrdersController : ControllerBase
{
    [HttpPost]
    public ActionResult<object> Create([FromBody] CreateOrderDto dto) =>
        Ok(new { created = true, dto.Customer, dto.Quantity });
}

sealed class TimingActionFilter : IActionFilter
{
    private long _start;

    public void OnActionExecuting(ActionExecutingContext context) =>
        _start = Environment.TickCount64;

    public void OnActionExecuted(ActionExecutedContext context)
    {
        var elapsed = Environment.TickCount64 - _start;
        context.HttpContext.Response.Headers["X-Action-Ms"] = elapsed.ToString();
        DemoConsole.Step("TimingFilter", $"{elapsed}ms");
    }
}
