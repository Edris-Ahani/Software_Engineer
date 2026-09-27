# OAuth 2.0 & OpenID Connect (OIDC)

## What is it?
In the early days of the internet, if you wanted to play a new game and invite your Facebook friends, the game would ask you to type in your actual Facebook username and password. This was a massive security nightmare. **OAuth 2.0** and **OpenID Connect** were created to solve this.

## OAuth 2.0 (Authorization)
- **Purpose**: It is a framework that allows an application to gain limited access to a user's account on a third-party service (like Google or GitHub), **without** giving the application the user's password.
- **Analogy**: A hotel key card. You give the guest a key card that only opens their specific room, for exactly 3 days. You don't give them the master key to the whole hotel.
- **How it works**: The user clicks "Connect to Google". They are redirected to Google's website. They log in to Google, and Google asks "Do you want to grant this app access to your calendar?". If the user clicks yes, Google sends the app a temporary **Access Token**.

## OpenID Connect / OIDC (Authentication)
- **The Problem with OAuth**: OAuth was only designed for *Authorization* (granting access to APIs like a calendar), not for *Authentication* (proving who the user actually is). Developers started abusing OAuth to log users in, which caused security flaws.
- **The Solution**: OpenID Connect is a thin layer built *on top* of OAuth 2.0. 
- **How it works**: When the user authenticates, alongside the Access Token, the server also returns an **ID Token** (which is a strictly formatted JWT - JSON Web Token). This ID Token contains certified information about the user (e.g., their name, email, and profile picture).
- **Result**: This is what powers the modern **Single Sign-On (SSO)** experience and the "Log in with Google/Apple/Microsoft" buttons you see everywhere.

## Identity Providers (IdP)
Instead of building a complex, secure login system from scratch (handling password resets, two-factor authentication (2FA), and email verification), modern backend engineers often outsource this to an Identity Provider using OIDC.
- **Popular IdPs**: Auth0, AWS Cognito, Keycloak (Open Source), Okta.
