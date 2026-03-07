# JWT Auth with Public/Private Keys + Refresh Token Tracking

This project is an Express + MongoDB authentication API built for mentees.
It uses:

- `bcrypt` for password hashing
- JWT access and refresh tokens signed with RSA private keys (`RS256`)
- JWT verification with RSA public keys
- refresh token tracking in MongoDB
- automatic deletion of expired refresh-token records using a TTL index

## What Mentees Will Learn

- How password hashing and token-based auth work together
- How asymmetric JWT signing works (`private key` signs, `public key` verifies)
- Why refresh tokens are stored in DB (hashed) and validated server-side
- How MongoDB TTL cleanup can delete expired token records automatically

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- `jsonwebtoken`
- `bcrypt`
- `cookie-parser`

## Project Structure

```text
auth-jwt-public-private-key-tracked-token/
|-- app.js
|-- package.json
|-- README.md
|-- config/
|   `-- env.js
|-- controllers/
|   |-- auth.controller.js
|   `-- user.controller.js
|-- database/
|   `-- mongodb.js
|-- middlewares/
|   |-- authenticate.middleware.js
|   `-- error.middleware.js
|-- models/
|   |-- refresh_token.model.js
|   `-- user.model.js
`-- routes/
	|-- auth.routes.js
	`-- user.routes.js
```

## Environment Variables

Create `.env.development.local` (or matching your `NODE_ENV`) with the following:

```env
PORT=5500
NODE_ENV=development
DB_URI=mongodb://127.0.0.1:27017/your_db_name

# Examples: 15m, 1h, 7d
ACCESS_TOKEN_EXPIRE_DATE=15m
REFRESH_TOKEN_EXPIRE_DATE=7d

# Keep full PEM content. Use \n in one-line env values.
ACCESS_TOKEN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
ACCESS_TOKEN_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
REFRESH_TOKEN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
REFRESH_TOKEN_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
```

Notes:

- `config/env.js` converts `\n` to real line breaks so PEM keys work.
- Access and refresh tokens use different key pairs.

## Generate RSA Key Pairs (Example)

Use OpenSSL (run twice: one pair for access token, one pair for refresh token):

```bash
openssl genrsa -out access_private.key 2048
openssl rsa -in access_private.key -pubout -out access_public.key

openssl genrsa -out refresh_private.key 2048
openssl rsa -in refresh_private.key -pubout -out refresh_public.key
```

## Installation and Run

```bash
npm install
npm run dev
```

Or:

```bash
npm start
```

## API Endpoints

Base URL: `http://localhost:5500/api/v1`

### Auth Routes

- `POST /auth/sign-up`
- `POST /auth/sign-in`
- `POST /auth/refresh-token`

### User Routes

- `GET /users/me` (requires valid access token cookie)

## Current Auth Flow in This Codebase

1. User signs up or signs in with email/password.
2. Password is hashed with `bcrypt` and compared with `bcrypt.compare` at login.
3. Server signs:
- access token with `ACCESS_TOKEN_PRIVATE_KEY` (`RS256`)
- refresh token with `REFRESH_TOKEN_PRIVATE_KEY` (`RS256`)
4. Server sets both tokens in HTTP-only cookies:
- `access_token` (15 minutes cookie maxAge)
- `refresh_token` (7 days cookie maxAge)
5. Server hashes the refresh token (`sha256`) before storing it in `refresh_tokens` collection.
6. On `/auth/refresh-token`:
- read refresh token from cookie
- hash it and verify it exists in DB
- verify JWT with `REFRESH_TOKEN_PUBLIC_KEY`
- mint new access token and set new `access_token` cookie

## Refresh Token DB Tracking and Auto Cleanup

`models/refresh_token.model.js` stores:

- `user_id`
- `refresh_token` (hashed)
- `created_at`
- `expires_at`

The model defines this TTL index:

```js
RefreshTokenSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });
```

That means MongoDB automatically deletes refresh-token documents once `expires_at` is reached.

## Cookies Used

- `httpOnly: true`
- `sameSite: "lax"`
- `secure: false` (development-friendly; use `true` in production with HTTPS)



Built for learning and mentoring.
