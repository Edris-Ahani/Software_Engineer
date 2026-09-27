# JSON Web Token (JWT)

## What is it?
JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret (with the HMAC algorithm) or a public/private key pair using RSA or ECDSA.

## Structure of a JWT
A JWT consists of three parts separated by dots (`.`):
1. **Header**: Consists of two parts: the type of the token (JWT) and the signing algorithm being used (e.g., HMAC SHA256 or RSA).
2. **Payload**: Contains the claims. Claims are statements about an entity (typically, the user) and additional data.
3. **Signature**: To create the signature part you have to take the encoded header, the encoded payload, a secret, the algorithm specified in the header, and sign that.

Example format: `xxxxx.yyyyy.zzzzz`

## What Problems Does It Solve?
- **Stateless Authentication**: Unlike session-based authentication where the server stores session IDs in memory or a database, JWT allows the server to verify the user without looking up the database, as the token itself contains all necessary information (stateless).
- **Cross-Domain/CORS**: Because the token is sent in the HTTP header (usually `Authorization: Bearer <token>`), it works well across different domains.
- **Mobile Friendliness**: Excellent for mobile applications where cookies and traditional session management are difficult to maintain.

## When and Where to Use It?
- **Authorization**: This is the most common scenario for using JWT. Once the user is logged in, each subsequent request will include the JWT, allowing the user to access routes, services, and resources that are permitted with that token.
- **Information Exchange**: JWTs are a good way of securely transmitting information between parties.

## Examples

### Node.js Example (using `jsonwebtoken` package)
```javascript
const jwt = require('jsonwebtoken');

const secretKey = 'my_super_secret_key';

// 1. Generate a JWT (Login)
function generateToken(user) {
    const payload = {
        id: user.id,
        role: user.role
    };
    // Token expires in 1 hour
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

// 2. Verify a JWT (Middleware for protected routes)
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, decodedUser) => {
        if (err) return res.sendStatus(403);
        
        req.user = decodedUser;
        next();
    });
}
```
