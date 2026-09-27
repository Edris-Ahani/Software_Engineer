# Software Testing Fundamentals

## What is it?
Software Testing in backend development is the practice of evaluating and verifying that a software application or its specific components function exactly as intended. Automated testing involves writing code to test your production code.

## Types of Tests
1. **Unit Tests**: Test the smallest individual components of code (like a single function or class) in isolation. Mocks and stubs are used to simulate external dependencies (like databases).
2. **Integration Tests**: Verify that different modules or services work properly together. For example, testing if the application correctly saves data to a real or test database.
3. **End-to-End (E2E) Tests**: Test the entire application flow from start to finish, simulating real user scenarios (from the API endpoint all the way to the database and back).

## What Problems Does It Solve?
- **Regressions**: Prevents new code changes from breaking existing features.
- **Confidence**: Gives developers the confidence to refactor and optimize code, knowing the tests will catch any mistakes.
- **Documentation**: Well-written tests serve as a living documentation of what the code is supposed to do.
- **Bug Reduction**: Catches bugs early in the development cycle before they reach production.

## When and Where to Use It?
Testing should be a continuous part of the development lifecycle, typically automated in a CI/CD pipeline. Every significant logic block, edge case, and critical user flow should have automated tests.

## Examples

### Node.js Example (Unit Testing with Jest)
```javascript
// math.js
function add(a, b) {
    return a + b;
}
module.exports = { add };

// math.test.js
const { add } = require('./math');

describe('Math Operations', () => {
    
    // A single Unit Test
    test('should correctly add two numbers', () => {
        // Arrange
        const num1 = 5;
        const num2 = 10;
        
        // Act
        const result = add(num1, num2);
        
        // Assert
        expect(result).toBe(15);
    });
    
});
```
