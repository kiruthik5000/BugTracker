# ---------- Stage 1: build ----------
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom first so dependencies are cached unless pom.xml changes
COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests -B

# ---------- Stage 2: run ----------
FROM eclipse-temurin:21-jre
WORKDIR /app

# Run as a non-root user
RUN useradd -r -u 1001 spring
USER spring

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]