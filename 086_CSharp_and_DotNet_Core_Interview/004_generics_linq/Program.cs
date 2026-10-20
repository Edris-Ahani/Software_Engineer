/**
 * 004 — Generics, collections, LINQ
 * Run: dotnet run --project 004_generics_linq
 */
using DemoLog;

DemoConsole.Title("004 | Generics, Collections & LINQ");

DemoConsole.Section("1) Generic repository-style helper");
var repo = new InMemoryRepo<string>();
repo.Add("alpha");
repo.Add("beta");
DemoConsole.Step("Count", repo.Count);
DemoConsole.Step("First", repo.Items.First());

DemoConsole.Section("2) Common collections");
var list = new List<int> { 1, 2, 3 };
var dict = new Dictionary<string, int> { ["a"] = 1, ["b"] = 2 };
var set = new HashSet<int> { 1, 1, 2, 3 };
DemoConsole.Step("List", string.Join(",", list));
DemoConsole.Step("Dictionary[b]", dict["b"]);
DemoConsole.Step("HashSet (unique)", string.Join(",", set));

DemoConsole.Section("3) LINQ query operators");
var people = new[]
{
    new { Name = "Ada", Age = 36 },
    new { Name = "Linus", Age = 28 },
    new { Name = "Grace", Age = 41 },
};

var names = people
    .Where(p => p.Age >= 30)
    .OrderByDescending(p => p.Age)
    .Select(p => p.Name)
    .ToArray();

DemoConsole.Step("Age>=30 ordered", string.Join(" > ", names));
DemoConsole.Step("Average age", people.Average(p => p.Age));
DemoConsole.Step("Group by decade", string.Join(", ",
    people.GroupBy(p => p.Age / 10 * 10).Select(g => $"{g.Key}s:{g.Count()}")));

DemoConsole.Section("4) Deferred execution");
IEnumerable<int> query = Enumerable.Range(1, 5).Select(x =>
{
    DemoConsole.Step("projecting", x);
    return x * x;
});
DemoConsole.Note("Nothing projected yet (deferred).");
var materialized = query.ToList();
DemoConsole.Step("materialized", string.Join(",", materialized));
DemoConsole.Ok("LINQ is deferred until enumerated; ToList/ToArray force execution.");

sealed class InMemoryRepo<T>
{
    private readonly List<T> _items = [];
    public IReadOnlyList<T> Items => _items;
    public int Count => _items.Count;
    public void Add(T item) => _items.Add(item);
}
