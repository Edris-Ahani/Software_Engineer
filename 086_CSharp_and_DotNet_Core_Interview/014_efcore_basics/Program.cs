/**
 * 014 — EF Core basics (InMemory)
 * Run: dotnet run --project 014_efcore_basics
 */
using DemoLog;
using Microsoft.EntityFrameworkCore;

DemoConsole.Title("014 | EF Core Basics");

const string url = "http://127.0.0.1:5114";
var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls(url);
builder.Logging.ClearProviders();

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseInMemoryDatabase("interview-demo"));
builder.Services.AddScoped<BookService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Books.AddRange(
        new Book { Title = "CLR via C#", Year = 2012 },
        new Book { Title = "Pro ASP.NET Core", Year = 2023 });
    db.SaveChanges();
}

app.MapGet("/books", async (BookService svc) => await svc.ListAsync());
app.MapPost("/books", async (CreateBook dto, BookService svc) =>
{
    var book = await svc.AddAsync(dto.Title, dto.Year);
    return Results.Created($"/books/{book.Id}", book);
});

await app.StartAsync();
using var client = new HttpClient { BaseAddress = new Uri(url) };

DemoConsole.Section("1) Query");
DemoConsole.Step("GET /books", await client.GetStringAsync("/books"));

DemoConsole.Section("2) Insert");
var created = await client.PostAsJsonAsync("/books", new CreateBook("Domain-Driven Design", 2003));
DemoConsole.Step("POST status", (int)created.StatusCode);
DemoConsole.Step("POST body", await created.Content.ReadAsStringAsync());

DemoConsole.Section("3) Lifetime rule");
DemoConsole.Ok("Register DbContext as Scoped — never Singleton, never share across threads.");
DemoConsole.Note("InMemory provider is for demos/tests; production uses SQL Server/PostgreSQL/etc.");

await app.StopAsync();

sealed class Book
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public int Year { get; set; }
}

sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Book> Books => Set<Book>();
}

sealed class BookService(AppDbContext db)
{
    public Task<List<Book>> ListAsync() => db.Books.OrderBy(b => b.Id).ToListAsync();

    public async Task<Book> AddAsync(string title, int year)
    {
        var book = new Book { Title = title, Year = year };
        db.Books.Add(book);
        await db.SaveChangesAsync();
        return book;
    }
}

record CreateBook(string Title, int Year);
