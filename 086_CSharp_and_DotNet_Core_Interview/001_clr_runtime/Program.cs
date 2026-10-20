/**
 * 001 — CLR / .NET runtime architecture
 * Run: dotnet run --project 001_clr_runtime
 */
using System.Reflection;
using System.Runtime.InteropServices;
using DemoLog;

DemoConsole.Title("001 | CLR & .NET Runtime Architecture");

DemoConsole.Section("1) Runtime facts");
DemoConsole.Step("Environment.Version", Environment.Version);
DemoConsole.Step("RuntimeInformation.FrameworkDescription", RuntimeInformation.FrameworkDescription);
DemoConsole.Step("OS", RuntimeInformation.OSDescription);
DemoConsole.Step("ProcessArchitecture", RuntimeInformation.ProcessArchitecture);
DemoConsole.Step("Is64BitProcess", Environment.Is64BitProcess);
DemoConsole.Ok(".NET Core / .NET = cross-platform CLR + Base Class Library (no Windows-only Framework lock-in)");

DemoConsole.Section("2) Assembly / type loading");
var asm = Assembly.GetExecutingAssembly();
DemoConsole.Step("Entry assembly", asm.GetName().Name);
DemoConsole.Step("Location", asm.Location);
DemoConsole.Step("Defined types count", asm.GetTypes().Length);
DemoConsole.Note("Managed code is compiled to IL, then JIT-compiled to native code by the CLR.");

DemoConsole.Section("3) Managed vs unmanaged");
DemoConsole.Step("GC.GetTotalMemory(false)", GC.GetTotalMemory(false));
DemoConsole.Step("GC.MaxGeneration", GC.MaxGeneration);
DemoConsole.Step("IntPtr.Size (pointer width)", IntPtr.Size);
DemoConsole.Ok("Most app code is managed; P/Invoke / unsafe touch native memory when needed.");

DemoConsole.Section("4) App model");
DemoConsole.Step("ProcessorCount", Environment.ProcessorCount);
DemoConsole.Step("CurrentDirectory", Environment.CurrentDirectory);
DemoConsole.Step("CommandLine args", string.Join(" | ", args));
DemoConsole.Ok("A .NET process hosts the CLR, loads assemblies, and runs managed threads on the ThreadPool.");
