# Library Management System API

## Project Overview

This is a RESTful API for a Library Management System built with Node.js and Express.js, using PostgreSQL as the database. It provides functionalities for managing books, borrowers, and the borrowing process, along with several non-functional requirements and bonus features.

## Features

### Functional Requirements

1.  **Books Management:**
    *   Add a book with details: title, author, ISBN, available quantity, and shelf location.
    *   Update a book’s details by ID.
    *   Delete a book by ID.
    *   List all books.
    *   Search for a book by title, author, or ISBN.
2.  **Borrowers Management:**
    *   Register a borrower with details: name, email, and registered date.
    *   Update a borrower’s details by ID.
    *   Delete a borrower by ID.
    *   List all borrowers.
3.  **Borrowing Process:**
    *   A borrower can check out a book. The system tracks checked-out books and by whom.
    *   A borrower can return a book.
    *   A borrower can check the books they currently have.
    *   The system tracks due dates and lists overdue books.

### Non-Functional Requirements

*   **Performance:** Optimized for reading operations with database indexing.
*   **Scalability:** Designed with a modular structure (services, controllers, routes) to support future features.
*   **Security:** User inputs are validated using `express-validator` to prevent common threats like SQL injection.
*   **Error Handling:** The system gracefully handles errors and provides meaningful feedback via a global error handling middleware.

### Implemented Bonus Features

1.  **Analytical Reports & Data Export:**
    *   Exports all overdue borrows of the last month (JSON, CSV, or XLSX format).
    *   Exports all borrowing processes of the last month (JSON, CSV, or XLSX format).
2.  **Rate Limiting:** Implemented for `POST /api/books` and `POST /api/borrowers` endpoints to prevent abuse.
3.  **Basic Authentication:** Implemented for `POST /api/books` and `POST /api/borrowers` endpoints.
4.  **Unit Tests:** Added unit tests for the `books.service.js` module using Mocha, Chai, and Sinon.
5.  **Dockerization:** The application is Dockerized using Docker Compose for consistent local development and easier deployment.

## Technologies Used

*   **Backend:** Node.js, Express.js
*   **Database:** PostgreSQL
*   **Database Client:** `pg`
*   **Environment Variables:** `dotenv`
*   **Input Validation:** `express-validator`
*   **Rate Limiting:** `express-rate-limit`
*   **Basic Authentication:** `express-basic-auth`
*   **CSV Generation:** `csv-stringify`
*   **XLSX Generation:** `exceljs`
*   **Testing:** Mocha, Chai, Sinon
*   **Containerization:** Docker, Docker Compose

## Project Structure

```
.
├── controllers/          # Handles request logic, interacts with services
├── middlewares/          # Express middleware (validation, auth, rate limiting)
├── routes/               # Defines API endpoints and maps to controllers
├── services/             # Contains business logic and database interactions
├── test/                 # Unit tests
│   └── services/
├── .env                  # Environment variables (local config)
├── .env.example          # Example .env file
├── Dockerfile            # Instructions to build Node.js Docker image
├── docker-compose.yml    # Defines multi-container application (app + db)
├── db.js                 # PostgreSQL connection pool
├── index.js              # Main Express application entry point
├── init_db.js            # Database table creation script
├── add_indexes.js        # Database indexing script
└── package.json          # Project dependencies and scripts
```

## Setup and Running the Project

You can run the project either locally (managing PostgreSQL yourself) or using Docker Compose (recommended).

### Prerequisites

*   **Node.js & npm:** [Install Node.js](https://nodejs.org/en/download/) (which includes npm).
*   **PostgreSQL:**
    *   **For Local Run:** [Install PostgreSQL](https://www.postgresql.org/download/) on your machine.
    *   **For Docker Compose:** [Install Docker Desktop](https://www.docker.com/products/docker-desktop/).
*   **Postman/Insomnia:** For API testing.

### Step 1: Clone the Repository & Install Dependencies

```bash
# Clone the repository (if applicable)
# git clone <your-repo-url>
# cd library-management-system

npm install
```

### Step 2: Configure Environment Variables (`.env`)

Create a `.env` file in the root directory of the project. This file will store your database and application configuration.

#### Option A: Running Locally (without Docker)

If you plan to run your PostgreSQL database directly on your machine:

```dotenv
DB_USER=library_user
DB_HOST=localhost
DB_DATABASE=library_db
DB_PASSWORD=password
DB_PORT=5432
PORT=3000
```

#### Option B: Running with Docker Compose (Recommended)

If you plan to use Docker Compose, your application container will communicate with the database container using Docker's internal networking.

```dotenv
DB_USER=library_user
DB_HOST=db # Important: This refers to the 'db' service name in docker-compose.yml
DB_DATABASE=library_db
DB_PASSWORD=password
DB_PORT=5432
PORT=3000
```

### Step 3: Database Setup

#### Option A: Local PostgreSQL Setup

1.  **Start your local PostgreSQL server.**
2.  **Create a PostgreSQL User and Database:**
    Open your PostgreSQL client (e.g., `psql` in your terminal) and run:
    ```sql
    CREATE USER library_user WITH PASSWORD 'password';
    CREATE DATABASE library_db OWNER library_user;
    GRANT ALL PRIVILEGES ON DATABASE library_db TO library_user;
    \q
    ```
    *   *Adjust `library_user` and `password` if you used different credentials in your `.env`.*
3.  **Initialize Database Tables and Indexes:**
    ```bash
    node init_db.js
    node add_indexes.js
    ```

#### Option B: Docker Compose Setup (Recommended)

1.  **Ensure Docker Desktop is running.** Check the Docker icon in your macOS menu bar; it should be stable.
2.  **Build and Start Services:**
    In the project root directory, run:
    ```bash
    docker compose up --build -d
    ```
    *   `--build`: Builds the Node.js application image.
    *   `-d`: Runs containers in detached mode (background).
    *   *The `command` in `docker-compose.yml` will automatically run `npm install`, `node init_db.js`, and `node add_indexes.js` inside the `app` container, setting up the database in the `db` container.*

    **Troubleshooting `docker compose` command not found:** If `docker compose` doesn't work, try `docker-compose` (with a hyphen) instead.

3.  **Verify Services (Optional):**
    ```bash
    docker compose ps
    ```
    (or `docker-compose ps`)
    You should see `db` and `app` services with `Up` status.

4.  **Stop Services:**
    ```bash
    docker compose down
    ```
    (or `docker-compose down`)
    This stops and removes the containers but keeps the database data volume.

5.  **Clean Up (Stop and Remove All, Including Data):**
    ```bash
    docker compose down -v
    ```
    (or `docker-compose down -v`)
    **Use with caution! This will delete your database data.**

### Step 4: Run the Application

#### Option A: Local Run

```bash
npm start   # For production mode
npm run dev # For development mode (with nodemon for auto-restarts)
```

#### Option B: Docker Compose Run

If you followed the Docker Compose setup, your application is already running as part of `docker compose up -d`.

### Step 5: Access the API

The API will be running on `http://localhost:3000`.

## API Endpoints

All endpoints are prefixed with `http://localhost:3000/api`.

---

### Books Endpoints (`/api/books`)

*   **`POST /`** - **Create a new book**
    *   **Requires:** Basic Authentication (`admin:supersecret`), Rate Limiting, Input Validation.
    *   **Body:** `{ "title": "...", "author": "...", "isbn": "...", "available_quantity": ..., "shelf_location": "..." }`
*   **`GET /`** - **List all books**
*   **`GET /search?query={search_term}`** - **Search for books** by title, author, or ISBN.
*   **`PUT /:id`** - **Update a book's details**
    *   **Body:** `{ "title": "...", "author": "...", "isbn": "...", "available_quantity": ..., "shelf_location": "..." }` (all fields optional for update)
*   **`DELETE /:id`** - **Delete a book**

---

### Borrowers Endpoints (`/api/borrowers`)

*   **`POST /`** - **Register a new borrower**
    *   **Requires:** Basic Authentication (`admin:supersecret`), Rate Limiting, Input Validation.
    *   **Body:** `{ "name": "...", "email": "..." }`
*   **`GET /`** - **List all borrowers**
*   **`PUT /:id`** - **Update a borrower's details**
    *   **Body:** `{ "name": "...", "email": "..." }` (both fields optional for update)
*   **`DELETE /:id`** - **Delete a borrower**

---

### Borrowing Process Endpoints (`/api/borrowing`)

*   **`POST /checkout`** - **Check out a book**
    *   **Body:** `{ "book_id": ..., "borrower_id": ..., "due_date": "YYYY-MM-DD" }`
*   **`PUT /return/:id`** - **Return a book** (where `:id` is the `borrow_record_id`)
*   **`GET /borrower/:borrower_id`** - **List books currently borrowed** by a specific borrower.
*   **`GET /overdue`** - **List all overdue books**.

---

### Reporting Endpoints (`/api/reports`)

*   **`GET /overdue-last-month?format={json|csv|xlsx}`** - **Exports all overdue borrows** from the last month.
    *   Default format is `json`.
    *   Example for CSV: `/api/reports/overdue-last-month?format=csv`
*   **`GET /all-borrows-last-month?format={json|csv|xlsx}`** - **Exports all borrowing processes** from the last month.
    *   Default format is `json`.
    *   Example for XLSX: `/api/reports/all-borrows-last-month?format=xlsx`

## Testing

### Unit Tests

To run the unit tests for the `books.service.js` module:

```bash
npm test
```

### API Testing with Postman

A Postman Collection JSON file containing all the above endpoints and example requests has been generated.

1.  **Import the Collection:** In Postman, click `File` > `Import` > `Raw Text` and paste the generated JSON.
2.  **Set Environment Variables:**
    *   Create a new environment (e.g., "Library Local").
    *   Add a variable `base_url` with value `http://localhost:3000`.
    *   The collection includes a "Tests" script that attempts to automatically set `book_id`, `borrower_id`, and `borrow_record_id` after successful `POST` requests. You may need to manually update these if automation fails or for specific scenarios.
3.  **Basic Authentication:** For `POST /api/books` and `POST /api/borrowers`, go to the "Authorization" tab in Postman, select "Basic Auth", and enter Username: `admin`, Password: `supersecret`.

---

This `README.md` should provide a comprehensive guide for anyone setting up and running your Library Management System.
