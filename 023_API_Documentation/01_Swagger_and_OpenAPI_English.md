# API Documentation (OpenAPI/Swagger)

## What is it?
API Documentation is a technical content deliverable containing instructions about how to effectively use and integrate with an API. The **OpenAPI Specification** (formerly known as **Swagger** Specification) is an API description format for REST APIs. 

## Key Concepts
- **OpenAPI Specification (OAS)**: A standard, language-agnostic interface to RESTful APIs which allows both humans and computers to discover and understand the capabilities of the service without access to source code. It is typically written in YAML or JSON.
- **Swagger UI**: A collection of HTML, Javascript, and CSS assets that dynamically generate beautiful documentation from an OAS-compliant API. It allows anyone to visualize and interact with the API's resources without having any of the implementation logic in place.

## What Problems Does It Solve?
- **Frontend-Backend Collaboration**: Instead of backend developers verbally explaining or writing messy Word documents on how an API works, the documentation acts as the single source of truth for the frontend team.
- **Client Generation**: Based on the OpenAPI spec, you can automatically generate client SDKs in multiple languages (TypeScript, Python, Java, etc.).
- **Interactive Testing**: Allows developers and third-party consumers to test API endpoints directly from the documentation page in their browser.

## Other Popular API Tools
- **Postman / Insomnia**: Powerful GUI applications used for developing, testing, sharing, and documenting APIs.

## Examples

### OpenAPI Example (YAML)
```yaml
openapi: 3.0.0
info:
  title: Simple User API
  version: 1.0.0
paths:
  /users/{id}:
    get:
      summary: Returns a user by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: A user object
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
                  name:
                    type: string
        '404':
          description: User not found
```
