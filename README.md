# BugReporter 🐛

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-blueviolet.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

BugReporter is a robust, full-stack bug tracking and management system designed to streamline the software development lifecycle. It provides a collaborative environment for Testers, Developers, and Project Managers to identify, track, and resolve software defects efficiently.

---

## 🚀 Key Features

- **Role-Based Access Control (RBAC)**: 
  - **Admin**: Full system control and user management.
  - **Project Manager**: Project oversight and bug assignment.
  - **Tester**: Bug reporting and validation.
  - **Developer**: Status updates and resolution tracking.
- **Bug Lifecycle Management**: Track bugs through various states: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`, and `REOPENED`.
- **Assignment System**: Project Managers can assign specific bugs to Developers based on expertise and workload.
- **Priority Matrix**: Categorize issues from `LOW` to `CRITICAL` to prioritize urgent fixes.
- **Interactive Dashboard**: Comprehensive overview of bug statistics and project health.
- **Secure Authentication**: Implementation of JWT (JSON Web Tokens) for stateless, secure session management.
- **Modern Responsive UI**: A sleek, intuitive interface built with React 19 and Tailwind CSS 4.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Security**: Spring Security + JWT
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA / Hibernate
- **API Documentation**: SpringDoc OpenAPI (Swagger)
- **Build Tool**: Maven

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4.0
- **HTTP Client**: Axios
- **Routing**: React Router 7
- **State Management**: React Context API

---

## ⚙️ Installation & Setup

### Prerequisites
- **Java**: JDK 17+
- **Node.js**: 18.x or higher
- **MySQL**: 8.0+
- **Maven**: 3.8+ (or use provided `mvnw`)

### 1. Database Configuration
1. Create a MySQL database named `bug_tracker`.
2. Update the credentials in `Backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/bug_tracker
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

### 2. Backend Setup
```bash
cd Backend
# Build and run the application
./mvnw spring-boot:run
```
The server will start at `http://localhost:8080`.

### 3. Frontend Setup
```bash
cd Frontend
# Install dependencies
npm install
# Start the development server
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 📖 API Documentation

The project includes integrated Swagger documentation. Once the backend is running, you can explore and test the API endpoints at:
`http://localhost:8080/swagger-ui/index.html`

---

## 📁 Project Structure

```text
BugReporter/
├── Backend/           # Spring Boot Application
│   ├── src/main/java/ # Business logic, Controllers, Entities
│   └── pom.xml        # Backend dependencies
└── Frontend/          # React Application
    ├── src/           # UI Components, Pages, Hooks
    └── vite.config.js # Vite configuration
```

---

## 🤝 Contributing

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git checkout -b feature/AmazingFeature`).
5. Open a Pull Request.

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
