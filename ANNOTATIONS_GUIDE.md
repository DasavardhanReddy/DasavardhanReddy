# Java Spring Boot Annotations Reference Guide

## Complete Annotation Reference

### JPA/Hibernate Entity Annotations

#### `@Entity`

Marks a Java class as a JPA entity (database table).

```java
@Entity
@Table(name = "drivers")
public class Driver { }
```

#### `@Table`

Specifies the table name and schema.

```java
@Table(name = "drivers", schema = "public")
public class Driver { }
```

#### `@Id`

Marks a field as the primary key.

```java
@Id
private Long id;
```

#### `@GeneratedValue`

Specifies how the primary key is auto-generated.

```java
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```

**Strategies:**

- `IDENTITY` - Database auto-increment (MySQL)
- `SEQUENCE` - Database sequence (Oracle, PostgreSQL)
- `TABLE` - Dedicated ID generation table
- `UUID` - UUID generation

#### `@Column`

Configures column properties.

```java
@Column(name = "driver_name", nullable = false, length = 100, unique = true)
private String name;
```

**Options:**

- `name` - Column name (default: field name)
- `nullable` - Allow NULL values
- `length` - String length constraint
- `unique` - Unique constraint
- `precision, scale` - For decimal numbers
- `updatable` - Can be updated
- `insertable` - Can be inserted

#### `@Transient`

Excludes a field from being persisted.

```java
@Transient
private String temporaryData;
```

#### `@Enumerated`

Maps enum values to database.

```java
@Enumerated(EnumType.STRING)
private VehicleStatus status;
```

**Types:**

- `STRING` - Store as string (e.g., "IDLE")
- `ORDINAL` - Store as number (e.g., 0)

### Relationship Annotations

#### `@OneToMany`

One entity has many related entities.

```java
@OneToMany(mappedBy = "driver", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
private List<Vehicle> vehicles;
```

**Parameters:**

- `mappedBy` - Owning side reference
- `cascade` - Propagate operations
- `fetch` - Loading strategy (LAZY/EAGER)

#### `@ManyToOne`

Many entities reference one entity.

```java
@ManyToOne(fetch = FetchType.EAGER)
@JoinColumn(name = "driver_id", nullable = false)
private Driver driver;
```

#### `@OneToOne`

One-to-one relationship.

```java
@OneToOne(mappedBy = "profile")
private User user;
```

#### `@ManyToMany`

Many-to-many relationship (uses join table).

```java
@ManyToMany
@JoinTable(name = "user_roles",
           joinColumns = @JoinColumn(name = "user_id"),
           inverseJoinColumns = @JoinColumn(name = "role_id"))
private List<Role> roles;
```

#### `@JoinColumn`

Specifies the foreign key column.

```java
@ManyToOne
@JoinColumn(name = "driver_id", nullable = false)
private Driver driver;
```

#### `@LazyCollection`

Alternative to FetchType (Hibernate-specific).

```java
@LazyCollection(LazyCollectionOption.FALSE)
private List<Vehicle> vehicles;
```

### Lifecycle Callbacks

#### `@PrePersist`

Before INSERT operation.

```java
@PrePersist
protected void onCreate() {
    createdAt = LocalDateTime.now();
}
```

#### `@PostPersist`

After INSERT operation.

```java
@PostPersist
protected void afterCreate() {
    System.out.println("Driver created with ID: " + id);
}
```

#### `@PreUpdate`

Before UPDATE operation.

```java
@PreUpdate
protected void onUpdate() {
    updatedAt = LocalDateTime.now();
}
```

#### `@PostUpdate`

After UPDATE operation.

#### `@PreRemove`

Before DELETE operation.

#### `@PostRemove`

After DELETE operation.

---

## Spring Framework Annotations

### Stereotypes

#### `@Component`

Generic Spring component.

```java
@Component
public class MyComponent { }
```

#### `@Service`

Service layer component (for business logic).

```java
@Service
public class DriverService { }
```

#### `@Repository`

Data access layer component.

```java
@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> { }
```

#### `@Controller`

Web controller for serving views.

```java
@Controller
public class PageController { }
```

#### `@RestController`

REST controller (returns JSON, not views).

```java
@RestController
public class DriverController { }
```

### Dependency Injection

#### `@Autowired`

Automatically injects dependencies.

```java
@Autowired
private DriverService driverService;
```

**Locations:**

- Field injection (above)
- Constructor injection
- Setter injection

#### `@Qualifier`

Specifies which bean to inject (when multiple exist).

```java
@Autowired
@Qualifier("primaryDriver")
private Driver driver;
```

#### `@Primary`

Marks a bean as primary choice.

```java
@Service
@Primary
public class PrimaryDriverService { }
```

#### `@Lazy`

Defers bean initialization.

```java
@Autowired
@Lazy
private DriverService driverService;
```

### Transactional

#### `@Transactional`

Wraps method in database transaction.

```java
@Service
@Transactional
public class DriverService {
    public Driver createDriver(Driver driver) {
        // Automatically commits or rolls back
    }
}
```

**Properties:**

- `propagation` - Transaction propagation
- `isolation` - Isolation level
- `timeout` - Transaction timeout
- `readOnly` - Read-only transaction

### Request Mapping

#### `@RequestMapping`

Maps HTTP requests to handler methods.

```java
@RequestMapping("/api/drivers")
public class DriverController { }
```

#### `@GetMapping`

Maps GET requests (shorthand for @RequestMapping(method=GET)).

```java
@GetMapping
public List<Driver> getAllDrivers() { }

@GetMapping("/{id}")
public Driver getDriver(@PathVariable Long id) { }
```

#### `@PostMapping`

Maps POST requests.

```java
@PostMapping
public Driver createDriver(@RequestBody Driver driver) { }
```

#### `@PutMapping`

Maps PUT requests (update).

```java
@PutMapping("/{id}")
public Driver updateDriver(@PathVariable Long id, @RequestBody Driver driver) { }
```

#### `@DeleteMapping`

Maps DELETE requests.

```java
@DeleteMapping("/{id}")
public void deleteDriver(@PathVariable Long id) { }
```

#### `@PatchMapping`

Maps PATCH requests (partial update).

### Request Parameters

#### `@PathVariable`

Extracts variable from URL path.

```java
@GetMapping("/{id}/drivers")
public List<Driver> getVehicleDrivers(@PathVariable Long id) { }
```

#### `@RequestParam`

Extracts query string parameters.

```java
@GetMapping
public List<Driver> searchDrivers(@RequestParam String q) { }
// GET /drivers?q=john
```

#### `@RequestBody`

Extracts and deserializes request body.

```java
@PostMapping
public Driver createDriver(@RequestBody Driver driver) { }
```

#### `@RequestHeader`

Extracts HTTP headers.

```java
public void method(@RequestHeader("Authorization") String auth) { }
```

#### `@CookieValue`

Extracts cookie values.

```java
public void method(@CookieValue String jsessionid) { }
```

### Response Annotations

#### `@ResponseBody`

Converts return value to response body (automatic with @RestController).

```java
@ResponseBody
@GetMapping
public List<Driver> getAll() { }
```

#### `@ResponseStatus`

Sets HTTP response status.

```java
@ResponseStatus(HttpStatus.CREATED)
@PostMapping
public Driver create(@RequestBody Driver driver) { }
```

#### `@CrossOrigin`

Enables CORS (Cross-Origin Resource Sharing).

```java
@RestController
@CrossOrigin(origins = "*")
public class DriverController { }
```

---

## Data JPA Annotations

### Repository Queries

#### `@Query`

Defines custom JPQL/SQL query.

```java
@Query("SELECT d FROM Driver d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :name, '%'))")
List<Driver> findByNameContaining(@Param("name") String name);
```

#### `@Param`

Maps method parameter to query parameter.

```java
@Query("SELECT d FROM Driver d WHERE d.name = :name")
Driver findByName(@Param("name") String name);
```

#### `@Modifying`

For queries that modify data (INSERT, UPDATE, DELETE).

```java
@Modifying
@Query("UPDATE Driver d SET d.name = :name WHERE d.id = :id")
void updateDriver(@Param("id") Long id, @Param("name") String name);
```

#### `@Transactional`

Required with @Modifying queries.

```java
@Modifying
@Transactional
@Query("DELETE FROM Driver d WHERE d.id = :id")
void deleteDriver(@Param("id") Long id);
```

---

## Configuration Annotations

#### `@Configuration`

Marks class as configuration source.

```java
@Configuration
public class DatabaseConfig {
    @Bean
    public DataSource dataSource() { }
}
```

#### `@Bean`

Declares a bean for Spring container.

```java
@Configuration
public class AppConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

#### `@SpringBootApplication`

Combines @Configuration, @EnableAutoConfiguration, @ComponentScan.

```java
@SpringBootApplication
public class DvrApplication {
    public static void main(String[] args) {
        SpringApplication.run(DvrApplication.class, args);
    }
}
```

#### `@Value`

Injects property values.

```java
@Value("${server.port}")
private int port;

@Value("${spring.datasource.url}")
private String dbUrl;
```

#### `@PropertySource`

Specifies properties file location.

```java
@PropertySource("classpath:app.properties")
public class AppConfig { }
```

---

## Validation Annotations

#### `@NotNull`

Field cannot be null.

```java
@NotNull
private String name;
```

#### `@NotEmpty`

String, collection cannot be null/empty.

```java
@NotEmpty
private String name;

@NotEmpty
private List<Item> items;
```

#### `@NotBlank`

String cannot be null/empty/whitespace only.

```java
@NotBlank
private String name;
```

#### `@Min / @Max`

Number min/max values.

```java
@Min(18)
@Max(100)
private int age;
```

#### `@Email`

Valid email format.

```java
@Email
private String email;
```

#### `@Size`

String/collection size constraints.

```java
@Size(min = 2, max = 50)
private String name;
```

#### `@Pattern`

Regex validation.

```java
@Pattern(regexp = "[0-9]{10}")
private String phone;
```

---

## Lombok Annotations

Lombok generates boilerplate code automatically.

#### `@Data`

Generates @Getter, @Setter, @ToString, @EqualsAndHashCode, @RequiredArgsConstructor.

```java
@Data
public class Driver {
    private String name;
    // Generates getName(), setName(), toString(), equals(), hashCode()
}
```

#### `@Getter`

Generates getter methods.

```java
@Getter
private String name;
```

#### `@Setter`

Generates setter methods.

```java
@Setter
private String name;
```

#### `@NoArgsConstructor`

Generates no-arg constructor.

```java
@NoArgsConstructor
public class Driver { }
```

#### `@AllArgsConstructor`

Generates constructor with all fields.

```java
@AllArgsConstructor
public class Driver {
    private String name;
    private String phone;
    // Generates: Driver(String name, String phone)
}
```

#### `@RequiredArgsConstructor`

Constructor for final/non-null fields.

```java
@RequiredArgsConstructor
public class Driver {
    private final String name; // Included in constructor
    private String phone;       // Not included
}
```

#### `@ToString`

Generates toString() method.

```java
@ToString(exclude = "sensitive")
public class Driver { }
```

#### `@EqualsAndHashCode`

Generates equals() and hashCode().

```java
@EqualsAndHashCode(exclude = "id")
public class Driver { }
```

#### `@Slf4j`

Generates static logger instance.

```java
@Slf4j
public class DriverService {
    // log is automatically available
    log.info("Driver created");
}
```

---

## Best Practices

### 1. Entity Design

```java
@Entity
@Table(name = "drivers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

### 2. Repository Design

```java
@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    @Query("SELECT d FROM Driver d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Driver> searchByName(@Param("q") String q);
}
```

### 3. Service Design

```java
@Service
@Transactional
@RequiredArgsConstructor
public class DriverService {
    private final DriverRepository repository;

    public Driver createDriver(Driver driver) {
        return repository.save(driver);
    }
}
```

### 4. Controller Design

```java
@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
public class DriverController {
    private final DriverService service;

    @GetMapping
    public ResponseEntity<List<Driver>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping
    public ResponseEntity<Driver> create(@Valid @RequestBody Driver driver) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(driver));
    }
}
```

---

## Execution Flow with Annotations

```
1. Client sends HTTP request
   ↓
2. @RequestMapping/@GetMapping routes to method
   ↓
3. @PathVariable/@RequestParam extracts parameters
   ↓
4. @RequestBody deserializes JSON to object
   ↓
5. @Autowired injects dependencies
   ↓
6. @Service method executes
   ↓
7. @Transactional wraps in transaction
   ↓
8. @Repository saves/retrieves from database
   ↓
9. @ResponseBody serializes response to JSON
   ↓
10. @ResponseStatus sets HTTP status
   ↓
11. Response sent to client
```

---

## Common Annotation Combinations

### REST Controller with Dependency Injection

```java
@RestController
@RequestMapping("/api/resource")
@RequiredArgsConstructor
public class ResourceController {
    private final ResourceService service;
}
```

### Service with Transaction Management

```java
@Service
@Transactional
@RequiredArgsConstructor
public class ResourceService {
    private final ResourceRepository repository;
}
```

### Entity with Relationships

```java
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL)
    private List<Trip> trips;
}
```

---

This comprehensive guide covers all essential annotations for the DVR project conversion!
