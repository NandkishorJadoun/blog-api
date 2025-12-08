# Blog API

A robust Node.js RESTful API for blog management, supporting user authentication, post creation, commenting, and more. This project is built with best practices for scalability, maintainability, and security.

## Table of Contents
- [Features](#features)
- [Tech Stack & Libraries](#tech-stack--libraries)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Validation & Error Handling](#validation--error-handling)
- [Environment Variables](#environment-variables)
- [Setup & Run](#setup--run)

## Features

- **User Management**
  - Signup & Login with hashed password storage (bcryptjs).
  - JWT-based authentication and Passport integration.
- **Posts**
  - Create, read, update, delete blog posts.
  - Fetch posts by author.
  - Only authenticated users can create/edit/delete their own posts.
  - Word-count validation for content (120-1500 words).
- **Comments**
  - Add, list, update, delete comments on posts.
  - Comment length validation (1-1000 characters).
- **Error Handling**
  - Custom error classes (`CustomNotFoundError`, `CustomForbiddenError`).
  - Centralized error middleware for consistent API responses.
- **Input Validation**
  - Comprehensive validation using `express-validator` on all major inputs.
- **CORS Support**
  - Configured to allow specified frontend apps access.
- **Prisma ORM**
  - Database access via Prisma for relational data modeling.

## Tech Stack & Libraries

- **Node.js:** Core runtime.
- **Express:** Web framework for defining RESTful routes and middleware.
- **Prisma (`@prisma/client`):** ORM for database operations.
- **Passport.js:** Authentication middleware for Express.
  - `passport-local` for email/password login.
  - `passport-jwt` for token-based authentication.
- **bcryptjs:** Secure password hashing.
- **express-validator:** Strong validation of all inputs.
- **jsonwebtoken (`jwt`):** JWT token signing.
- **cors:** CORS support for APIs.
- **dotenv:** Environment variable loading.
- **ESLint (+ `@eslint/js`, `globals`):** Linting, code style.

## Project Structure

```
├── app.js                   # Main Express app setup
├── configs/
│   ├── prisma.js            # Prisma client setup
│   └── passport.js          # Passport configuration (JWT, local)
├── controllers/             # Route handlers (posts, users, accounts)
├── middlewares/
│   └── validator.js         # Input validation logic
├── routes/                  # API route definitions
├── errors/                  # Custom error classes
├── .env                     # Environment variables (not in repo)
└── eslint.config.mjs        # ESLint configuration
```

## API Endpoints

```
Base: /api/v1

### Accounts
POST   /accounts/signup       - Register a new user
POST   /accounts/login        - Login and receive JWT

### Users
GET    /users/:id             - Fetch user details
GET    /users/:id/posts       - List posts by user
GET    /users/:id/comments    - List comments by user

### Posts
GET    /posts/                - List all public posts
GET    /posts/:postId         - Fetch a post by ID
GET    /posts/author          - Get posts from authenticated author
POST   /posts/                - Create new post (authenticated)
PUT    /posts/:postId         - Update post by ID (authenticated)
DELETE /posts/:postId         - Delete post by ID (authenticated)
GET    /posts/:postId/comments    - List comments on post

### Comments
POST   /posts/:postId/comments                    - Add new comment (authenticated)
PUT    /posts/:postId/comments/:commentId         - Update comment (authenticated)
DELETE /posts/:postId/comments/:commentId         - Delete comment (authenticated)
```

## Validation & Error Handling

- Uses `express-validator` on all user, post, and comment inputs:
  - **User:** first/last name only alpha, email format & uniqueness, password rules, matching confirm password.
  - **Posts:** title (10-120 chars), content (120-1500 words).
  - **Comments:** 1-1000 chars.
- Centralized error handler returns consistent status codes and messages.
- Custom Errors:
  - `CustomNotFoundError` (404)
  - `CustomForbiddenError` (403)

## Environment Variables

- `PORT` - Server port
- `FRONTEND_1_URL`, `FRONTEND_2_URL` - CORS allowed origins
- `JWT_SECRET_KEY` - JWT signing secret
- **Prisma DB config** - As required by your database connection

All environment variables should be defined in your `.env` file (not included in the repo).

## Setup & Run

1. **Clone and install:**
   ```sh
   git clone https://github.com/NandkishorJadoun/blog-api.git
   cd blog-api
   npm install
   ```

2. **Configure Environment:**
   - Add `.env` file and set required variables.

3. **Setup Prisma:**
   ```sh
   npx prisma migrate dev      # Set up database schema
   npx prisma generate         # Generate Prisma client
   ```

4. **Start Server:**
   ```sh
   node --watch app.js
   ```

---

**Author:** [Nandkishor Jadoun](https://github.com/NandkishorJadoun)