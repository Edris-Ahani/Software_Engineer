/**
 * 003 — Types, OOP, records, nullable
 * Run: dotnet run --project 003_types_oop
 */
using DemoLog;

DemoConsole.Title("003 | Types & OOP");

DemoConsole.Section("1) Value vs reference");
var a = new Point(1, 2);
var b = a;
b.X = 99;
DemoConsole.Step("struct copy is independent", $"a.X={a.X}, b.X={b.X}");

var c = new Person("Ada");
var d = c;
d.Name = "Grace";
DemoConsole.Step("class shares reference", $"c.Name={c.Name}, d.Name={d.Name}");

DemoConsole.Section("2) Boxing");
object boxed = 10; // boxing
int unboxed = (int)boxed;
DemoConsole.Step("boxed.GetType()", boxed.GetType().Name);
DemoConsole.Step("unboxed", unboxed);
DemoConsole.Warn("Boxing allocates; avoid in hot loops.");

DemoConsole.Section("3) Inheritance / polymorphism / interface");
Shape[] shapes = [new Circle(2), new Square(3)];
foreach (var shape in shapes)
{
    DemoConsole.Step(shape.GetType().Name, $"area={shape.Area():0.##}, tag={shape.Tag}");
}

DemoConsole.Section("4) Record + nullable");
var dto = new UserDto("u1", "Ada");
var dto2 = dto with { Name = "Ada Lovelace" };
string? maybe = null;
DemoConsole.Step("record equality", dto == new UserDto("u1", "Ada"));
DemoConsole.Step("with-expression Name", dto2.Name);
DemoConsole.Step("nullable is null?", maybe is null);
DemoConsole.Ok("Records shine for immutable DTOs; nullable reference types catch null bugs at compile time.");

struct Point
{
    public int X;
    public int Y;
    public Point(int x, int y) => (X, Y) = (x, y);
}

class Person
{
    public string Name { get; set; }
    public Person(string name) => Name = name;
}

abstract class Shape
{
    public abstract double Area();
    public virtual string Tag => "shape";
}

sealed class Circle(double r) : Shape
{
    public override double Area() => Math.PI * r * r;
    public override string Tag => "circle";
}

sealed class Square(double side) : Shape, ITaggable
{
    public override double Area() => side * side;
    public override string Tag => "square";
    string ITaggable.Tag => "square-via-interface";
}

interface ITaggable
{
    string Tag { get; }
}

record UserDto(string Id, string Name);
