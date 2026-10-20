/**
 * 006 — Delegates, events, Func/Action
 * Run: dotnet run --project 006_delegates_events
 */
using DemoLog;

DemoConsole.Title("006 | Delegates, Events, Func/Action");

DemoConsole.Section("1) Delegate / multicast");
MathOp op = Add;
op += Multiply;
DemoConsole.Step("multicast last return", op(3, 4));
DemoConsole.Note("Multicast invokes all; return value is from the last subscriber.");

DemoConsole.Section("2) Func / Action / Predicate");
Func<int, int, int> sum = (x, y) => x + y;
Action<string> printer = s => DemoConsole.Step("Action", s);
Predicate<int> isEven = n => n % 2 == 0;
DemoConsole.Step("Func sum", sum(2, 5));
printer("hello");
DemoConsole.Step("isEven(4)", isEven(4));

DemoConsole.Section("3) Events (publish/subscribe)");
var bus = new OrderBus();
bus.OrderPlaced += (_, e) => DemoConsole.Step("listener A", e.OrderId);
bus.OrderPlaced += (_, e) => DemoConsole.Step("listener B", e.OrderId);
bus.Place("ORD-42");
DemoConsole.Ok("Events restrict invoke to the declaring type; safer than public delegates.");

DemoConsole.Section("4) LINQ-friendly callbacks");
int[] nums = [1, 2, 3, 4, 5];
var doubledOdds = nums.Where(n => n % 2 == 1).Select(n => n * 2).ToArray();
DemoConsole.Step("doubled odds", string.Join(",", doubledOdds));

static int Add(int x, int y)
{
    DemoConsole.Step("Add", $"{x}+{y}");
    return x + y;
}

static int Multiply(int x, int y)
{
    DemoConsole.Step("Multiply", $"{x}*{y}");
    return x * y;
}

delegate int MathOp(int x, int y);

sealed class OrderBus
{
    public event EventHandler<OrderEventArgs>? OrderPlaced;

    public void Place(string orderId) =>
        OrderPlaced?.Invoke(this, new OrderEventArgs(orderId));
}

sealed class OrderEventArgs(string orderId) : EventArgs
{
    public string OrderId { get; } = orderId;
}
