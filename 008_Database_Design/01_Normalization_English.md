# Database Normalization

## What is it?
Database Normalization is the process of structuring a relational database in accordance with a series of so-called normal forms in order to reduce data redundancy and improve data integrity. It involves organizing the columns and tables of a database to ensure that their dependencies make logical sense.

## Normal Forms
The most common normal forms are:
- **1NF (First Normal Form)**: Each table cell should contain a single value (atomic values). Each record needs to be unique (primary key).
- **2NF (Second Normal Form)**: Must be in 1NF. All non-key attributes must be fully functional dependent on the primary key (no partial dependencies).
- **3NF (Third Normal Form)**: Must be in 2NF. There are no transitive functional dependencies (non-key attributes do not depend on other non-key attributes).

## What Problems Does It Solve?
- **Data Redundancy**: Prevents the same data from being stored in multiple places, saving disk space.
- **Insert Anomalies**: Fixes issues where certain data cannot be inserted into the database without the presence of other data.
- **Update Anomalies**: Fixes issues where updating a single data value requires updating multiple rows, which could lead to inconsistencies.
- **Delete Anomalies**: Fixes issues where deleting a row containing data about one fact inadvertently deletes data about another fact.

## When and Where to Use It?
Normalization is crucial when designing **Relational Databases (SQL)** like PostgreSQL, MySQL, or SQL Server. 
*Note: In NoSQL databases (like MongoDB) or Data Warehouses designed for heavy read operations, denormalization (intentionally adding redundancy) is often preferred for performance reasons.*

## Examples

### Before Normalization (Unnormalized Form)
Imagine a table storing students and their enrolled courses:

| StudentID | StudentName | Courses              | Professor   |
|-----------|-------------|----------------------|-------------|
| 1         | John Doe    | Math, Physics        | Dr. Smith   |
| 2         | Jane Doe    | Math, Chemistry      | Dr. Adams   |

### After Normalization (3NF)

**1. Students Table**
| StudentID | StudentName |
|-----------|-------------|
| 1         | John Doe    |
| 2         | Jane Doe    |

**2. Courses Table**
| CourseID | CourseName | ProfessorID |
|----------|------------|-------------|
| 101      | Math       | 201         |
| 102      | Physics    | 202         |
| 103      | Chemistry  | 203         |

**3. Professors Table**
| ProfessorID | ProfessorName |
|-------------|---------------|
| 201         | Dr. Smith     |
| 203         | Dr. Adams     |

**4. Enrollments Table (Junction Table)**
| StudentID | CourseID |
|-----------|----------|
| 1         | 101      |
| 1         | 102      |
| 2         | 101      |
| 2         | 103      |
