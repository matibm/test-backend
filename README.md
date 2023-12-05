# NestJS Transactions and Users API

This project is a NodeJS application built with NestJS that provides functionality for managing transactions and users with basic security support using JWT tokens.

## Features

### Transactions Module
- Controller and service for handling transactions
- CRUD operations for transactions: creation, deletion, retrieval, and partial update

### Users Module
- Controller and service for managing users
- CRUD operations for users: creation, deletion, retrieval, and partial update

### Authentication Module
- Basic security support using username/password
- Generates JWT token sessions
- Custom decorator to secure controller endpoints with JWT token validation
- Sessions last at least 15 minutes

## Bonus Features

### Partially Updating User Transactions
- Algorithm to efficiently update transactions for a user with a large number of transactions
- Supports batch updates for improved performance


## Usage

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up the database and configuration
4. Run the application: `npm start`

## Contributing
Feel free to contribute by opening issues or submitting pull requests.

## License
This project is licensed under the [MIT License](LICENSE).
