namespace DemoLog;

/// <summary>
/// Shared console helpers for detailed, readable demo output.
/// </summary>
public static class DemoConsole
{
    public static void Title(string text)
    {
        Console.WriteLine();
        Console.WriteLine(new string('=', 64));
        Console.WriteLine($"  {text}");
        Console.WriteLine(new string('=', 64));
    }

    public static void Section(string text)
    {
        Console.WriteLine();
        Console.WriteLine(new string('-', 48));
        Console.WriteLine($"> {text}");
        Console.WriteLine(new string('-', 48));
    }

    public static void Step(string label) => Console.WriteLine($"  • {label}");

    public static void Step(string label, object? value) =>
        Console.WriteLine($"  • {label}: {value}");

    public static void Note(string text) => Console.WriteLine($"  i {text}");

    public static void Ok(string text) => Console.WriteLine($"  ✓ {text}");

    public static void Warn(string text) => Console.WriteLine($"  ! {text}");
}
