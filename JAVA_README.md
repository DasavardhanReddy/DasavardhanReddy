# DVR Project - Java Spring Boot Version

## Overview

This is a complete conversion of the DVR (Driving Vehicle Record) Management System from **Node.js + React + MongoDB** to **Java Spring Boot + HTML/CSS + MySQL**.

## Technology Stack

### Backend

- **Java 11+**
- **Spring Boot 3.1.5** - Web framework and dependency injection
- **Spring Data JPA** - Object-Relational Mapping (ORM)
- **Hibernate** - JPA implementation
- **MySQL 8.0** - Relational database
- **Maven** - Build and dependency management

### Frontend

- **HTML5** - Markup language
- **CSS3** - Pure CSS styling (no JavaScript frameworks)
- **Thymeleaf** - Server-side HTML templating

### Database

- **MySQL** - Relational database

## Project Structure

```
dvr-project/
├── src/main/java/com/dvr/
│   ├── controller/              # HTTP request handlers
│   │   ├── DriverController.java
│   │   ├── VehicleController.java
│   │   ├── TripController.java
│   │   └── PageController.java
│   ├── service/                 # Business logic layer
│   │   ├── DriverService.java
│   │   ├── VehicleService.java
│   │   └── TripService.java
│   ├── repository/              # Data access layer (JPA)
│   │   ├── DriverRepository.java
│   │   ├── VehicleRepository.java
│   │   ├── TripRepository.java
│   │   ├── TravelHistoryRepository.java
│   │   └── VehicleHistoryRepository.java
│   ├── model/                   # JPA Entity classes
│   │   ├── Driver.java
│   │   ├── Vehicle.java
│   │   ├── Trip.java
│   │   ├── TravelHistory.java
│   │   └── VehicleHistory.java
│   └── DvrApplication.java      # Main entry point
├── src/main/resources/
│   ├── templates/               # Thymeleaf HTML templates
│   │   ├── index.html
│   │   ├── drivers.html
│   │   ├── vehicles.html
│   │   └── trips.html
│   ├── static/
│   │   └── css/
│   │       └── style.css        # Pure CSS styling
│   └── application.yml          # Configuration file
├── pom.xml                      # Maven dependencies
└── docker-compose.yml           # MySQL Docker setup
```

## Installation & Setup

### Prerequisites

- Java 11 or higher
- Maven 3.6+
- MySQL 8.0+
- Git

### Step 1: Install MySQL

**Option A: Using Docker (Recommended)**

```bash
docker run --name mysql-dvr -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8.0
```

**Option B: Manual Installation**

1. Download from https://dev.mysql.com/downloads/mysql/
2. Install and start MySQL service

### Step 2: Create Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE dvr_project;
USE dvr_project;
```

### Step 3: Clone and Build

```bash
# Clone the project
git clone <your-repo>
cd dvr-project

# Build with Maven
mvn clean package

# Run the application
mvn spring-boot:run
```

### Step 4: Access the Application

Open your browser and go to:

```
http://localhost:8080
```

## Key Conversions Explained

### 1. Models (Mongoose → JPA)

**Before (Node.js/MongoDB):**

```javascript
const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  currentLocation: { ... }
});
module.exports = mongoose.model('Driver', DriverSchema);
```

**After (Java/Spring):**

```java
@Entity
@Table(name = "drivers")
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column
    private String phone;

    @OneToMany(mappedBy = "driver")
    private List<Vehicle> vehicles;
}
```

**Key Differences:**

- `mongoose.Schema` → `@Entity` class
- `type: String` → `String` (Java is strongly typed)
- `required: true` → `@Column(nullable = false)`
- Relationships explicit with `@OneToMany`, `@ManyToOne`

### 2. API Routes (Express → Spring Controllers)

**Before (Node.js/Express):**

```javascript
router.get("/drivers", async (req, res) => {
  const drivers = await Driver.find();
  res.json(drivers);
});

router.post("/drivers", async (req, res) => {
  const driver = await Driver.create(req.body);
  res.json(driver);
});
```

**After (Spring Boot):**

```java
@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    @GetMapping
    public ResponseEntity<List<Driver>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }

    @PostMapping
    public ResponseEntity<Driver> createDriver(@RequestBody Driver driver) {
        return ResponseEntity.ok(driverService.createDriver(driver));
    }
}
```

**Key Differences:**

- `router.get()` → `@GetMapping`
- `router.post()` → `@PostMapping`
- `req.body` → `@RequestBody`
- `req.params` → `@PathVariable`
- `req.query` → `@RequestParam`
- Manual `res.json()` → Automatic Jackson serialization

### 3. Database Operations (Mongoose Queries → JPA)

**Before (MongoDB):**

```javascript
// Find all
const drivers = await Driver.find();

// Find by ID
const driver = await Driver.findById(id);

// Find with filter
const drivers = await Driver.find({ name: { $regex: q, $options: "i" } });

// Create
const driver = await Driver.create({ name, phone });
```

**After (JPA):**

```java
// Find all
List<Driver> drivers = repository.findAll();

// Find by ID
Optional<Driver> driver = repository.findById(id);

// Custom query
@Query("SELECT d FROM Driver d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :name, '%'))")
List<Driver> findByNameContainingIgnoreCase(@Param("name") String name);

// Create
driver = repository.save(driver);
```

**Key Differences:**

- Repository extends `JpaRepository<Entity, ID>`
- Automatic CRUD methods provided
- Custom queries with `@Query` annotation
- Type-safe queries (compile-time checking)

### 4. Frontend (React → HTML/CSS)

**Before (React):**

```jsx
function Drivers() {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    fetch("/api/drivers")
      .then((r) => r.json())
      .then(setDrivers);
  }, []);

  return (
    <div>
      {drivers.map((d) => (
        <DriverCard key={d._id} driver={d} />
      ))}
    </div>
  );
}
```

**After (Thymeleaf + CSS):**

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
  <body>
    <table>
      <tbody>
        <tr th:each="driver : ${drivers}">
          <td th:text="${driver.name}">John</td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
```

**Key Differences:**

- Server renders HTML (not client-side)
- Pure CSS (no Material-UI, Styled Components)
- Thymeleaf loop with `th:each`
- Form submissions to controller methods
- No JavaScript needed for basic functionality

### 5. Database Schema (MongoDB → MySQL)

**MongoDB:**

- No schema enforced
- Document-oriented
- Nested arrays stored in document
- Flexible field types

**MySQL:**

- Strict schema
- Relational tables with foreign keys
- Separate tables for arrays (TravelHistory, VehicleHistory)
- Type constraints per column

**Driver Table:**

```sql
CREATE TABLE drivers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    current_place VARCHAR(200),
    current_location_lat DOUBLE,
    current_location_lng DOUBLE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME
);
```

**TravelHistory Table:**

```sql
CREATE TABLE travel_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    driver_id BIGINT NOT NULL,
    place_name VARCHAR(200),
    latitude DOUBLE,
    longitude DOUBLE,
    note VARCHAR(500),
    timestamp DATETIME NOT NULL,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE
);
```

## Configuration

### application.yml

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/dvr_project
    username: root
    password: root

  jpa:
    hibernate:
      ddl-auto: update # Auto-create tables

  thymeleaf:
    prefix: classpath:/templates/

server:
  port: 8080
```

**Key Points:**

- `ddl-auto: update` - Automatically creates/updates tables from entities
- `ddl-auto: validate` - For production (validate schema only)
- MySQL dialect automatically selected

## REST API Endpoints

### Drivers

```
GET    /api/drivers                 # List all drivers
GET    /api/drivers?q=john          # Search by name
GET    /api/drivers?place=mumbai    # Search by place
GET    /api/drivers/{id}            # Get driver by ID
POST   /api/drivers                 # Create driver
POST   /api/drivers/{id}/location   # Update location
DELETE /api/drivers/{id}            # Delete driver
```

### Vehicles

```
GET    /api/vehicles                # List all
GET    /api/vehicles/search?q=MH    # Search
GET    /api/vehicles/{id}           # Get by ID
POST   /api/vehicles                # Create
POST   /api/vehicles/{id}/assign    # Assign driver
DELETE /api/vehicles/{id}           # Delete
```

### Trips

```
GET    /api/trips                   # List all
GET    /api/trips/{id}              # Get by ID
POST   /api/trips                   # Create
PUT    /api/trips/{id}              # Update status
DELETE /api/trips/{id}              # Delete
```

## Web Pages

```
GET  /                   # Dashboard
GET  /drivers            # List drivers
GET  /drivers/new        # Add driver form
GET  /drivers/{id}       # Driver details
GET  /vehicles           # List vehicles
GET  /vehicles/new       # Add vehicle form
GET  /trips              # List trips
GET  /trips/new          # Create trip form
```

## Building & Deployment

### Development

```bash
mvn spring-boot:run
```

### Production Build

```bash
mvn clean package
java -jar target/dvr-project-1.0.0.jar
```

### Docker Deployment

```bash
docker build -t dvr-project .
docker run -p 8080:8080 --link mysql-dvr:db dvr-project
```

## Troubleshooting

### 1. Database Connection Error

```
com.mysql.cj.jdbc.exceptions.CommunicationsException: Communications link failure
```

**Solution:** Ensure MySQL is running

```bash
mysql.server start    # macOS
mysql --version       # verify installation
```

### 2. Port Already in Use

**Solution:** Change port in application.yml

```yaml
server:
  port: 8081
```

### 3. JPA LazyInitializationException

**Solution:** Use `@Transactional` on service methods or fetch eagerly

### 4. Template Not Found

**Solution:** Ensure HTML file is in `src/main/resources/templates/`

## Performance Optimization

### 1. Database Indexing

```java
@Column(columnDefinition = "VARCHAR(100) COLLATE utf8mb4_unicode_ci", nullable = false)
@Index(name = "idx_driver_name")
private String name;
```

### 2. Lazy Loading

```java
@OneToMany(mappedBy = "driver", fetch = FetchType.LAZY)
private List<Vehicle> vehicles;
```

### 3. Query Optimization

Use `@Query` with specific columns instead of loading entire entities

### 4. Connection Pooling

Already handled by HikariCP (included in Spring Boot)

## Migration from Node.js

### File Mapping

```
backend/models/Driver.js     → model/Driver.java
backend/routes/drivers.js    → controller/DriverController.java
frontend/pages/Drivers.js    → templates/drivers.html
frontend/src/api.js          → service layer + RestTemplate
```

### Dependencies Mapping

```
express          → Spring Web
mongoose         → Spring Data JPA
cors             → @CrossOrigin
dotenv           → application.yml
axios/fetch      → RestTemplate or JavaScript fetch
React/Material-UI → Thymeleaf + CSS
```

## Testing

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=DriverServiceTest

# Generate coverage report
mvn jacoco:report
```

## Documentation Files

- `JAVA_CONVERSION_GUIDE.md` - Detailed conversion explanations
- `pom.xml` - Maven dependencies
- `application.yml` - Configuration
- HTML templates - Thymeleaf views
- `style.css` - CSS styling

## Common Issues & Solutions

1. **Enum serialization error** - Ensure enum toString() matches JSON
2. **N+1 query problem** - Use `@Query` with JOIN FETCH
3. **CORS errors** - Add `@CrossOrigin(origins = "*")`
4. **Template variables not rendering** - Check `th:text` syntax

## Learning Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA Guide](https://spring.io/projects/spring-data-jpa)
- [Thymeleaf Tutorial](https://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Maven Guide](https://maven.apache.org/guides/)

## Support & Troubleshooting

For issues, check:

1. Application logs in console
2. MySQL connection status
3. Table schema in MySQL
4. JPA entity mappings
5. Thymeleaf template syntax

## License

This project is converted from the original Node.js version for learning and production use.

---

**Happy coding! 🚀**
