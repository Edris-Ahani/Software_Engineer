/**
 * 011 — Controllers vs Minimal APIs
 * Run: dotnet run --project 011_controllers_minimal_apis
 */
using DemoLog;
using Microsoft.AspNetCore.Mvc;

DemoConsole.Title("011 | Controllers & Minimal APIs");

const string url = "http://127.0.0.1:5111";
var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls(url);
builder.Logging.ClearProviders();
builder.Services.AddControllers();
builder.Services.AddSingleton<ProductService>();

var app = builder.Build();
app.MapControllers();

app.MapGet("/minimal/products", (ProductService svc) => Results.Ok(svc.All()));
app.MapGet("/minimal/products/{id:int}", (int id, ProductService svc) =>
{
    var item = svc.Find(id);
    return item is null ? Results.NotFound() : Results.Ok(item);
});

await app.StartAsync();
using var client = new HttpClient { BaseAddress = new Uri(url) };

DemoConsole.Section("1) Controller endpoint");
DemoConsole.Step("GET /api/products", await client.GetStringAsync("/api/products"));

DemoConsole.Section("2) Minimal API endpoint");
DemoConsole.Step("GET /minimal/products/1", await client.GetStringAsync("/minimal/products/1"));

DemoConsole.Section("3) Comparison");
DemoConsole.Ok("Controllers: attributes, filters, conventional structure for large APIs.");
DemoConsole.Ok("Minimal APIs: less ceremony, great for microservices and simple routes.");

await app.StopAsync();

public sealed class ProductService
{
    private readonly List<Product> _items =
    [
        new(1, "Keyboard"),
        new(2, "Mouse"),
    ];

    public IReadOnlyList<Product> All() => _items;
    public Product? Find(int id) => _items.FirstOrDefault(p => p.Id == id);
}

public record Product(int Id, string Name);

[ApiController]
[Route("api/[controller]")]
public sealed class ProductsController(ProductService products) : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<Product>> Get() => Ok(products.All());
}
