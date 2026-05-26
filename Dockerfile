# Stage 1: Build the application using Maven
FROM maven:3.9.4-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .

# Copy source code
COPY src ./src

# Build the application (skip tests for faster build)
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=builder /app/target/dvr-project-1.0.0.jar app.jar

# Expose the port the application runs on
EXPOSE 8080

# Set environment variables for database connection
ENV SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/dvr_project
ENV SPRING_DATASOURCE_USERNAME=root
ENV SPRING_DATASOURCE_PASSWORD=Dasav@7173

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
