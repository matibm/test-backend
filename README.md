# Test Nodejs Nestjs

## Overview

This project is a NestJS application that implements functionalities for managing transactions and users, with authentication support using JWT tokens. It utilizes MongoDB as the preferred database for storing data.

---

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Technologies Used](#technologies-used)

---

## Installation

To get started with this project, follow these steps:

1. Clone the repository.
```
git clone https://github.com/matibm/test-backend.git
```
2. Install dependencies.
```
cd test-backend
npm install
```
3. Set up environment variables.

Create a `.env` file at the root of the project and add necessary environment variables like `MONGO_URI`, `JWT_SECRET`, etc.

4. Start the server.

```
npm start
```

## Usage

### Running the Application

### API Documentation

- `/users`: Manages user-related operations (CRUD).
- `/transactions`: Manages transaction-related operations (CRUD).
- `/users/login`: Authentication-related endpoints for login and sessions.

See the complete documentation with Postman:
https://documenter.getpostman.com/view/12996092/2s9YeMzng7

### Authentication

The application uses JWT tokens for authentication. To access secure endpoints, obtain a token via the login endpoint (`/users/login`) and include it in the `Authorization` header for subsequent requests.

---

## Features

- **Transactions Module:**
  - Create, read, update, and delete transactions.
- **Users Module:**
  - Create, read, update, and delete user information.
- **Authentication:**
  - Basic security using JWT tokens with sessions lasting at least 15 minutes.
- **Bonus Features:**
  - Algorithm for partial updates to multiple transactions of a user.
  - MongoDB session cleanup using temporary data support.

---

## Technologies Used

- NestJS
- MongoDB
- TypeScript
- JWT for authentication
- TypeORM (for ORM with databases)


