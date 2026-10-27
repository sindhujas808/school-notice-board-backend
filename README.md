# School Notice Board Management System

## About the Project

The **School Notice Board Management System** is a backend application designed to centralize and simplify the management of school notices. It helps organize notices, users, categories, and departments through REST APIs, reducing dependence on traditional physical notice boards.

## Features

- **User Authentication:** Secure user registration and login using JWT authentication.
- **User Management:** Manage user information and roles.
- **Notice Management:** Create, view, update, and delete notices.
- **Category Management:** Organize notices by category.
- **Department Management:** Manage department-related information.
- **Notification Management:** Handle notifications through backend APIs.
- **File Management:** Support file-related operations through backend APIs.
- **API Documentation and Testing:** Explore and test REST endpoints using Swagger UI.

## Technologies Used

- **Language:** Java
- **Backend Framework:** Spring Boot
- **Database:** MySQL
- **ORM:** Spring Data JPA and Hibernate
- **Authentication:** JSON Web Token (JWT)
- **API Architecture:** REST APIs
- **API Testing:** Swagger UI
- **Build Tool:** Maven

## Project Architecture

The application follows a layered backend architecture:

- **Controller Layer:** Handles incoming HTTP requests and API responses.
- **Service Layer:** Contains business logic.
- **Repository Layer:** Communicates with the database using Spring Data JPA.
- **Entity Layer:** Represents database tables and their relationships.
- **Database Layer:** Stores application data in MySQL.

## Prerequisites

Make sure you have the following installed:

- Java 17
- Maven
- MySQL Server
- An IDE such as Visual Studio Code or IntelliJ IDEA

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sindhujas808/school-notice-board-backend
cd school-notice-board-backend
```

### 2. Configure the Database

Create a MySQL database:

```sql
CREATE DATABASE noticeboard_db;
```

### 3. Run the Application

Using Maven:

```bash
mvn spring-boot:run
```

The application runs on:

```text
http://localhost:8080
```

### 4. Access Swagger UI

If Swagger/OpenAPI is configured in the project, open:

```text
http://localhost:8080/swagger-ui/index.html
```

Use Swagger UI to explore and test the available API endpoints.

## Future Enhancements

- Develop a React-based user interface.
- Add advanced notice analytics and reporting.
- Introduce customizable approval workflows.
- Add multilingual support and improved notification options.

## Author

**Sindhuja K**  
B.E. Computer Science and Engineering  
Sri Krishna College of Engineering and Technology (SKCET)

## License

This project is developed for academic purposes.
