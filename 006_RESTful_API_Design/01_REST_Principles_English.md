# RESTful API Design Principles

## What is it?
REST (Representational State Transfer) is an architectural style for designing networked applications. It relies on a stateless, client-server communication protocol, almost always HTTP. RESTful APIs use HTTP methods (GET, POST, PUT, DELETE, PATCH) to perform CRUD (Create, Read, Update, Delete) operations on resources, which are identified by URLs.

## History and Origin
REST was introduced by Roy Fielding in his 2000 doctoral dissertation. He was one of the principal authors of the HTTP specification, and REST was designed to leverage the existing features of the web.

## What Problems Does It Solve?
- **Standardization**: Provides a uniform interface and predictable behavior across different web services.
- **Scalability**: Statelessness means servers don't need to retain session information, allowing them to scale horizontally easily.
- **Separation of Concerns**: Decouples the client (frontend) from the server (backend), allowing them to evolve independently.

## When and Where to Use It?
Use REST for building web APIs that need to be consumed by various clients (web apps, mobile apps, third-party services). It's the standard for general-purpose HTTP APIs.

## Examples

### Good vs Bad URL Design
```text
// BAD
GET /getUser?id=123
POST /createUser
POST /updateUser/123

// GOOD (RESTful)
GET /users/123
POST /users
PUT /users/123
DELETE /users/123
```

### Express.js Example
```javascript
const express = require('express');
const app = express();
app.use(express.json());

const users = [];

// Get all users
app.get('/users', (req, res) => {
    res.json(users);
});

// Create a new user
app.post('/users', (req, res) => {
    const newUser = { id: Date.now(), ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Get user by ID
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
});
```
