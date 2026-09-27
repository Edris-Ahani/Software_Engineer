# OAuth 2.0

## What is it?
OAuth 2.0 (Open Authorization) is an industry-standard authorization framework. It enables a third-party application to obtain limited access to an HTTP service, either on behalf of a resource owner (e.g., a user) or by allowing the third-party application to obtain access on its own behalf. It is NOT an authentication protocol (though OpenID Connect is built on top of it for that purpose), but an authorization protocol.

## Key Roles in OAuth 2.0
1. **Resource Owner**: The user who authorizes an application to access their account.
2. **Client**: The application wanting to access the user's account.
3. **Resource Server**: The server hosting the user's protected data (e.g., Google APIs).
4. **Authorization Server**: The server that authenticates the user and issues access tokens to the client.

## What Problems Does It Solve?
- **Password Anti-Pattern**: Before OAuth, users had to give their passwords to third-party apps to let them access their data (e.g., giving Yelp your Gmail password to find friends). OAuth eliminates this.
- **Granular Access Control**: Allows you to grant specific scopes (e.g., "read email" but not "delete email") to applications.
- **Revocation**: Users can easily revoke an application's access without changing their passwords.

## When and Where to Use It?
Use OAuth 2.0 when you need to allow users to log in using external providers (like "Login with Google/GitHub/Facebook") or when your application needs to access user data hosted on another service securely.

## Examples

### The OAuth 2.0 Flow (Authorization Code Grant)
1. **Client** redirects user to the **Authorization Server**.
2. **User** logs in and approves the requested permissions (scopes).
3. **Authorization Server** redirects user back to the **Client** with an `Authorization Code`.
4. **Client** sends the `Authorization Code` and its `Client Secret` to the **Authorization Server** behind the scenes.
5. **Authorization Server** returns an `Access Token`.
6. **Client** uses the `Access Token` to request data from the **Resource Server**.

### Node.js Example (using passport.js for Google OAuth)
```javascript
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // This callback is fired when Google returns the data
    // Use the profile data to find or create a user in your database
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

// Express Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```
