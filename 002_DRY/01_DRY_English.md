# Don't Repeat Yourself (DRY)

## What is it?
DRY is a software development principle aimed at reducing repetition of software patterns, replacing it with abstractions or using data normalization to avoid redundancy.

## History and Origin
The principle was formulated by Andy Hunt and Dave Thomas in their book "The Pragmatic Programmer" (1999). They stated: "Every piece of knowledge must have a single, unambiguous, authoritative representation within a system."

## What Problems Does It Solve?
- **Maintenance Nightmare**: When logic is duplicated, a bug fix or feature update requires changes in multiple places. If one place is missed, the system becomes inconsistent.
- **Code Bloat**: Repetition increases the size of the codebase, making it harder to read and understand.

## When and Where to Use It?
Use DRY whenever you find yourself writing the same logic, algorithm, or configuration more than once. Extract the common code into a function, module, or class.

## Examples

### JavaScript (Node.js)
```javascript
// BAD: Repeated logic
function calculateFullTimeSalary(hourlyRate) {
    const hoursPerWeek = 40;
    const weeksPerYear = 52;
    return hourlyRate * hoursPerWeek * weeksPerYear;
}

function calculatePartTimeSalary(hourlyRate) {
    const hoursPerWeek = 20;
    const weeksPerYear = 52;
    return hourlyRate * hoursPerWeek * weeksPerYear;
}

// GOOD: DRY approach
function calculateSalary(hourlyRate, hoursPerWeek) {
    const weeksPerYear = 52;
    return hourlyRate * hoursPerWeek * weeksPerYear;
}
```

### TypeScript

```typescript
// BAD: Repeated logic
function calculateFullTimeSalary(hourlyRate: number): number {
    const hoursPerWeek = 40;
    const weeksPerYear = 52;
    return hourlyRate * hoursPerWeek * weeksPerYear;
}

function calculatePartTimeSalary(hourlyRate: number): number {
    const hoursPerWeek = 20;
    const weeksPerYear = 52;
    return hourlyRate * hoursPerWeek * weeksPerYear;
}

// GOOD: DRY approach
function calculateSalary(hourlyRate: number, hoursPerWeek: number): number {
    const weeksPerYear = 52;
    return hourlyRate * hoursPerWeek * weeksPerYear;}
```

### C#
```csharp
// BAD: Repeated logic
public class ReportGenerator 
{
    public void GeneratePdfReport() 
    {
        Console.WriteLine("Connecting to database...");
        Console.WriteLine("Fetching data...");
        Console.WriteLine("Generating PDF...");
    }

    public void GenerateExcelReport() 
    {
        Console.WriteLine("Connecting to database...");
        Console.WriteLine("Fetching data...");
        Console.WriteLine("Generating Excel...");
    }
}

// GOOD: DRY approach
public class ReportGenerator 
{
    private void FetchData() 
    {
        Console.WriteLine("Connecting to database...");
        Console.WriteLine("Fetching data...");
    }

    public void GeneratePdfReport() 
    {
        FetchData();
        Console.WriteLine("Generating PDF...");
    }

    public void GenerateExcelReport() 
    {
        FetchData();
        Console.WriteLine("Generating Excel...");
    }
}
```
