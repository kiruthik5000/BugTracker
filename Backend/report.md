# JWT Authentication Implementation Report

This report details the changes made to the backend application to implement JWT-based authentication.

## 1. Summary of Changes

The primary goal of this refactoring was to replace the existing authentication mechanism with a secure JWT-based solution. The following key changes were made:

- **JWT Generation and Validation:** A `JwtUtil` class was implemented to handle the creation and verification of JWT tokens. It includes methods to generate tokens, extract claims, and validate token integrity and expiration.
- **JWT Authentication Filter:** A `JwtAuthFilter` was created to intercept incoming requests, extract the JWT token from the `Authorization` header, and perform authentication.
- **Spring Security Configuration:** The `SecurityConfig` was updated to integrate the `JwtAuthFilter` into the security filter chain and configure stateless session management.
- **Authentication Controller:** The `AuthController` was enhanced to provide endpoints for user login (`/api/auth/login`) and registration (`/api/auth/register`).
- **User Service:** The `UserService` was updated to encode user passwords before storing them in the database.

## 2. File-by-File Breakdown

### `pom.xml`

No major changes were needed here as the required dependencies for `spring-boot-starter-security` and `jjwt` were already present.

### `src/main/java/com/backend/security/JwtUtil.java`

- **`generateToken(String username, String role)`:** Creates a new JWT token with the user's username and role.
- **`extractUsername(String token)`:** Extracts the username from a given token.
- **`extractRole(String token)`:** Extracts the user's role from the token.
- **`validateToken(String token, UserDetails userDetails)`:** Validates the token by checking its expiration and ensuring the username matches the one in the `UserDetails`.
- **`isTokenExpired(String token)`:** Checks if the token is expired.

### `src/main/java/com/backend/security/JwtAuthFilter.java`

- This filter extends `OncePerRequestFilter` to ensure it's executed once per request.
- It extracts the JWT token from the `Authorization: Bearer <token>` header.
- It uses `JwtUtil` to validate the token.
- If the token is valid, it creates an `UsernamePasswordAuthenticationToken` and sets it in the `SecurityContextHolder`, effectively authenticating the user for the duration of the request.

### `src/main/java/com/backend/config/SecurityConfig.java`

- **`@EnableWebSecurity`:** Enables Spring Security's web security support.
- **`sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))`:** Configures Spring Security to be stateless, which is essential for a JWT-based approach.
- **`authorizeHttpRequests(...)`:**  Configures URL-based authorization.
  - `/api/auth/**` is permitted for all users to allow login and registration.
  - All other requests require authentication.
- **`addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)`:** Adds the `JwtAuthFilter` to the filter chain before the default `UsernamePasswordAuthenticationFilter`.
- **`authenticationManager(AuthenticationConfiguration config)`:** Exposes the `AuthenticationManager` as a bean for use in the `AuthController`.

### `src/main/java/com/backend/auth/AuthController.java`

- **`@RestController` and `@RequestMapping("/api/auth")`:** Defines this class as a REST controller with a base path for authentication-related endpoints.
- **`login(@RequestBody LoginRequest request)`:**
  - Authenticates the user using the `AuthenticationManager`.
  - If authentication is successful, it generates a JWT token using `JwtUtil` and returns it in the response.
- **`register(@RequestBody RegistrationRequest request)`:**
  - Creates a new `User` object.
  - Uses the `UserService` to save the new user (with an encoded password).
  - Generates a JWT token for the newly registered user and returns it.

### `src/main/java/com/backend/service/UserService.java`

- The `PasswordEncoder` is injected into the service.
- The `createUser` method now uses the `passwordEncoder` to hash the user's password before saving it to the database. This is a critical security measure to avoid storing passwords in plain text.

### `src/main/java/com/backend/auth/LoginRequest.java` & `src/main/java/com/backend/auth/RegistrationRequest.java`

- These are simple DTO (Data Transfer Object) classes used to map the JSON request bodies for the login and registration endpoints.

## 3. How it Works

1.  A user sends a `POST` request to `/api/auth/register` with their desired username, password, and email.
2.  The `AuthController` creates a new `User` and passes it to the `UserService`.
3.  The `UserService` encodes the password and saves the new user to the database.
4.  The `AuthController` generates a JWT token for the new user and sends it back in the response.
5.  The user can then send a `POST` request to `/api/auth/login` with their credentials.
6.  The `AuthenticationManager` validates the credentials.
7.  If successful, the `AuthController` generates a new JWT token and returns it.
8.  For subsequent requests to protected endpoints, the client must include the JWT token in the `Authorization` header as a Bearer token.
9.  The `JwtAuthFilter` intercepts the request, validates the token, and sets the user's authentication details in the security context.
10. The request then proceeds to the requested controller, and the application knows who the user is.

This implementation provides a robust and secure authentication system for the application.
