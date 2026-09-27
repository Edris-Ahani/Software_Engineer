# WebRTC (Web Real-Time Communication)

## What is it?
WebRTC is a free, open-source project that provides web browsers and mobile applications with real-time communication (RTC) via simple application programming interfaces (APIs). It enables audio, video, and data sharing directly between peers without requiring an intermediary server to relay the heavy media data.

## How it differs from WebSockets
- **WebSockets**: Uses a central server. User A sends a message to the Server, and the Server sends it to User B. Great for text chats.
- **WebRTC**: Peer-to-Peer (P2P). User A sends video directly to User B's IP address. The server is only used at the very beginning to help them find each other.

## The Signaling Server (The Matchmaker)
Because two laptops behind home routers don't know each other's public IP addresses, they need a "Signaling Server" (usually built with WebSockets) to exchange connection data (SDP and ICE candidates). Once they exchange this data and connect directly, the Signaling Server steps out of the way.

## STUN and TURN Servers
- **STUN**: A server that tells a browser "Here is your public IP address".
- **TURN**: Sometimes corporate firewalls are so strict that a direct P2P connection fails. A TURN server acts as a fallback relay to pass the video data between the users. It costs bandwidth and money to run.
