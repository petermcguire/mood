# Mood Tracking API

A NestJS application for tracking user mood levels over time. This service allows users to register, log in, and record their mood levels, providing a simple way to monitor emotional well-being.

## Features

- **User Management**: Create and retrieve user accounts
- **Authentication**: Secure JWT-based authentication
- **Mood Tracking**: Record and retrieve mood levels with timestamps
- **Date Filtering**: Filter mood records by date range
- **RESTful API**: Well-structured API following REST conventions

## Prerequisites

- Node.js (v20.18.0 or later recommended)
- npm (comes with Node.js)
- PostgreSQL database

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mood
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DB_DATABASE=mood_db
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret
   ```

4. Run database migrations:
   ```bash
   npm run migration:run
   ```

## Running the Application

```bash
# Development mode
$ npm run start

# Watch mode (auto-reload on changes)
$ npm run start:dev

# Production mode
$ npm run start:prod
```

The application will be available at http://localhost:3100

## API Documentation

### Authentication

- **POST /auth/login** - Authenticate a user and receive a JWT token
  - Request body: `{ "name": "username", "password": "password" }`
  - Response: `{ "userId": 1, "accessToken": "jwt_token" }`

### User Management

- **POST /user** - Create a new user (public endpoint)
  - Request body: `{ "name": "username", "password": "password" }`
  - Response: User object without password

- **GET /user/:id** - Get user by ID (protected endpoint)
  - Response: User object without password

### Mood Tracking

- **PATCH /user/:id/moods** - Add moods for a user (protected endpoint)
  - Request body: `[{ "level": 5, "timestamp": "2023-01-01T12:00:00Z" }]`
  - Response: Array of created mood objects

- **GET /user/:id/moods** - Get all moods for a user (protected endpoint)
  - Optional query parameters: `start` and `end` for date range filtering
  - Response: Array of mood objects

### Utility

- **GET /hello** - Simple health check endpoint (public endpoint)
  - Response: "Hello World!"

## Testing

```bash
# Unit tests
$ npm run test

# E2E tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

## Database Migrations

```bash
# Run migrations
$ npm run migration:run

# Generate a new migration (replace <name> with migration name)
$ npm run migration:generate --name=<name>

# Revert the last migration
$ npm run migration:revert
```

## Deployment

The application is configured for deployment on Fly.io:

1. Install the Fly CLI: https://fly.io/docs/hands-on/install-flyctl/

2. Authenticate with Fly.io:
   ```bash
   fly auth login
   ```

3. Deploy the application:
   ```bash
   fly deploy
   ```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

This project is licensed under the [UNLICENSED](LICENSE) license.
