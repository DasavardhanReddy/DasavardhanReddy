# Complete Java Spring Boot Conversion Guide

## Project Overview - From Node.js to Java

Your current stack:

- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React + JavaScript
- **Database**: MongoDB

New stack:

- **Backend**: Java Spring Boot (REST API)
- **Frontend**: HTML + CSS + Servlets
- **Database**: MySQL
- **Build**: Maven

---

## Step-by-Step Conversion Process

### Step 1: Project Structure

```
dvr-project/
├── src/
│   ├── main/
│   │   ├── java/com/dvr/
│   │   │   ├── controller/          # Spring Controllers (replaces Express routes)
│   │   │   ├── service/             # Business logic layer
│   │   │   ├── repository/          # Data access layer (JPA)
│   │   │   ├── model/               # JPA Entities (replaces Mongoose models)
│   │   │   ├── config/              # Configuration classes
│   │   │   └── DvrApplication.java  # Main Spring Boot class
│   │   ├── resources/
│   │   │   ├── templates/           # HTML templates for Thymeleaf
│   │   │   ├── static/              # CSS, JS, images
│   │   │   └── application.yml      # Database and server config
│   └── test/
├── pom.xml                          # Maven configuration
└── docker-compose.yml               # Docker setup for MySQL
```

### Step 2: Key Conversions

#### Models (MongoDB → MySQL/JPA)

| Node.js/MongoDB     | Java/JPA                       |
| ------------------- | ------------------------------ |
| mongoose.Schema     | @Entity class                  |
| ObjectId references | @OneToMany, @ManyToOne         |
| Mongoose hooks      | JPA callbacks or Service logic |
| JSON response       | Jackson serialization          |

#### API Routes (Express → Spring Controllers)

| Express          | Spring Boot       |
| ---------------- | ----------------- |
| router.get('/')  | @GetMapping("/")  |
| router.post('/') | @PostMapping("/") |
| req.params.id    | @PathVariable     |
| req.query        | @RequestParam     |
| req.body         | @RequestBody      |

#### Frontend (React → HTML + Servlets)

| React            | HTML/Servlet                |
| ---------------- | --------------------------- |
| npm packages     | Libraries via Maven         |
| JSX components   | HTML templates              |
| State management | Session/Model attributes    |
| fetch/axios      | RestTemplate or direct HTTP |

### Step 3: Database Schema

MySQL will replace MongoDB with relational tables:

- **drivers**: id, name, phone, current_location_lat, current_location_lng, current_place, created_at, updated_at
- **vehicles**: id, number, model, current_location, destination, status, driver_id, created_at, updated_at
- **trips**: id, vehicle_id, driver_id, from_location, to_location, cargo, date, profit, status
- **travel_history**: id, driver_id, place_name, latitude, longitude, note, timestamp

### Step 4: Development Server

Instead of `npm start`, use:

```bash
mvn spring-boot:run
```

### Step 5: Database Setup

1. Install MySQL (or use Docker)
2. Create database: `CREATE DATABASE dvr_project;`
3. Spring Boot + JPA will auto-create tables from entities

### Step 6: Configuration Files

- **application.yml**: Database connection, server port, JPA settings
- **pom.xml**: Dependencies (Spring Boot, MySQL driver, JPA, Thymeleaf)

### Step 7: Frontend Architecture

- **index.html**: Main page (Thymeleaf template)
- **CSS**: Pure CSS (no CSS-in-JS like Material-UI)
- **Servlets**: Handle GET/POST requests from forms
- **Controllers**: Return HTML views with data

---

## Key Differences to Understand

### 1. **Type Safety**

- **Before**: JavaScript (no compile-time type checking)
- **After**: Java (all types checked at compile time)
- **Benefit**: Catch errors before runtime

### 2. **Dependency Injection**

- **Before**: Manual imports in Node.js
- **After**: Spring's @Autowired for automatic dependency management
- **Benefit**: Cleaner, more maintainable code

### 3. **Database Relationships**

- **Before**: MongoDB references (manual join logic in code)
- **After**: JPA annotations (@OneToMany, @ManyToOne)
- **Benefit**: Relationships are explicit, automatic loading

### 4. **Request Handling**

- **Before**: Express middleware stack
- **After**: Spring's DispatcherServlet + Controllers
- **Benefit**: More standardized, industry-standard approach

### 5. **HTML Rendering**

- **Before**: React rendered everything client-side
- **After**: Thymeleaf template engine renders HTML server-side
- **Benefit**: Better SEO, simpler frontend, no JavaScript needed

---

## Building and Running

```bash
# Build the project
mvn clean package

# Run the application
mvn spring-boot:run

# Access the application
http://localhost:8080

# Run tests
mvn test
```

---

## Migration Checklist

- [ ] Create Maven project structure
- [ ] Add Spring Boot dependencies (pom.xml)
- [ ] Create JPA entities for Driver, Vehicle, Trip
- [ ] Configure MySQL connection in application.yml
- [ ] Create repositories (extending JpaRepository)
- [ ] Create services with business logic
- [ ] Create REST controllers for API endpoints
- [ ] Create HTML templates with Thymeleaf
- [ ] Add CSS styling
- [ ] Create servlets for form handling
- [ ] Test all CRUD operations
- [ ] Set up error handling and logging
- [ ] Deploy with Docker

---

## File Mapping (Old → New)

```
backend/models/Driver.js → src/main/java/com/dvr/model/Driver.java
backend/models/Vehicle.js → src/main/java/com/dvr/model/Vehicle.java
backend/models/Trip.js → src/main/java/com/dvr/model/Trip.java
backend/routes/drivers.js → src/main/java/com/dvr/controller/DriverController.java
backend/routes/vehicles.js → src/main/java/com/dvr/controller/VehicleController.java
frontend/src/pages/* → src/main/resources/templates/*.html
frontend/src/App.css → src/main/resources/static/css/style.css
frontend/src/api.js → Service layer + RestTemplate (Spring)
```

---

## Troubleshooting Common Issues

1. **Port already in use**: Change server.port in application.yml
2. **Database connection error**: Verify MySQL is running, credentials in application.yml
3. **JPA LazyInitializationException**: Use @Transactional or fetch eagerly
4. **Template not found**: Check file is in src/main/resources/templates/
5. **CSS not loading**: Verify file is in src/main/resources/static/css/
