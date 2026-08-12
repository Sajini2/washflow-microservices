# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy pom.xml and cache dependencies in a separate layer
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build application package
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy built JAR artifact from build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8083

ENTRYPOINT ["java", "-jar", "app.jar"]
