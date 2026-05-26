# 📑 File Index & Navigation Guide

## Quick Navigation

**Start Here:**

1. Read `IMPLEMENTATION_SUMMARY.md` - Overview of what was done
2. Read `JAVA_README.md` - How to set up and run
3. Check `QUICK_REFERENCE.md` - Quick lookup guide

---

## 📄 Documentation Files

### Getting Started

- **README.md** (original) - Original project info
- **JAVA_README.md** ⭐ **START HERE** - Complete setup guide
- **IMPLEMENTATION_SUMMARY.md** - What was converted
- **JAVA_CONVERSION_GUIDE.md** - Detailed conversion explanations

### Reference Guides

- **QUICK_REFERENCE.md** - Quick lookup for concepts and patterns
- **ANNOTATIONS_GUIDE.md** - Complete Java/Spring annotation reference
- **FILE_INDEX.md** - This file!

---

## ⚙️ Configuration Files

### Maven

```
pom.xml
├── Spring Boot 3.1.5 dependencies
├── MySQL driver 8.0.33
├── JPA/Hibernate
├── Thymeleaf
└── Lombok
```

### Spring Boot

```
src/main/resources/
├── application.yml
│   ├── MySQL connection (localhost:3306)
│   ├── JPA/Hibernate config
│   ├── Thymeleaf settings
│   └── Server port (8080)
```

---

## 🎯 Java Source Code

### Main Application Entry Point

```
src/main/java/com/dvr/
└── DvrApplication.java
    ├── @SpringBootApplication
    ├── main() method
    └── Starts embedded Tomcat server
```

### Models (JPA Entities)

```
src/main/java/com/dvr/model/
├── Driver.java
│   ├── Fields: name, phone, currentLocation, currentPlace
│   ├── Relationships: @OneToMany vehicles, travelHistory
│   └── Lifecycle: @PrePersist, @PreUpdate
│
├── Vehicle.java
│   ├── Fields: number, model, status (ENUM)
│   ├── Relationships: @ManyToOne driver, @OneToMany trips/history
│   └── Status: IDLE, LOADING, IN_TRANSIT
│
├── Trip.java
│   ├── Fields: from, to, cargo, profit (BigDecimal), status
│   ├── Relationships: @ManyToOne vehicle, driver
│   └── Status: PLANNED, ONGOING, COMPLETED
│
├── TravelHistory.java
│   ├── Fields: placeName, latitude, longitude, note, timestamp
│   ├── Relationship: @ManyToOne driver
│   └── Tracks: Driver location history
│
└── VehicleHistory.java
    ├── Fields: from, to, cargo, profit, notes, journey_date
    ├── Relationship: @ManyToOne vehicle
    └── Tracks: Vehicle trip history
```

### Repositories (Data Access)

```
src/main/java/com/dvr/repository/
├── DriverRepository.java
│   ├── findByNameContainingIgnoreCase(name)
│   ├── findByCurrentPlaceContainingIgnoreCase(place)
│   └── findByTravelHistoryPlaceContainingIgnoreCase(place)
│
├── VehicleRepository.java
│   ├── findByNumberContainingIgnoreCase(number)
│   ├── findByDriverNameContainingIgnoreCase(name)
│   ├── findByNumber(number)
│   └── findByStatus(status)
│
├── TripRepository.java
│   ├── findByVehicleId(vehicleId)
│   ├── findByDriverId(driverId)
│   ├── findByStatus(status)
│   └── findTripsBetweenDates(start, end)
│
├── TravelHistoryRepository.java
│   └── findByDriverId(driverId)
│
└── VehicleHistoryRepository.java
    └── findByVehicleId(vehicleId)
```

### Services (Business Logic)

```
src/main/java/com/dvr/service/
├── DriverService.java
│   ├── createDriver(driver)
│   ├── getAllDrivers()
│   ├── searchByName(name)
│   ├── searchByPlace(place)
│   ├── getDriverById(id)
│   ├── updateDriverLocation(id, lat, lng, place, note)
│   └── deleteDriver(id)
│
├── VehicleService.java
│   ├── createVehicle(vehicle)
│   ├── getAllVehicles()
│   ├── getVehicleById(id)
│   ├── searchVehicles(query)
│   ├── assignDriver(vehicleId, driverId)
│   ├── updateVehicleStatus(id, status)
│   └── deleteVehicle(id)
│
└── TripService.java
    ├── createTrip(trip)
    ├── getAllTrips()
    ├── getTripById(id)
    ├── getTripsByVehicle(vehicleId)
    ├── getTripsByDriver(driverId)
    ├── updateTripStatus(id, status)
    └── deleteTrip(id)
```

### Controllers (REST API + HTML Pages)

```
src/main/java/com/dvr/controller/
├── DriverController.java
│   ├── @RestController
│   ├── POST /api/drivers - Create
│   ├── GET /api/drivers - List/Search
│   ├── GET /api/drivers/{id} - Get by ID
│   ├── POST /api/drivers/{id}/location - Update location
│   └── DELETE /api/drivers/{id} - Delete
│
├── VehicleController.java
│   ├── @RestController
│   ├── POST /api/vehicles - Create
│   ├── GET /api/vehicles - List
│   ├── GET /api/vehicles/search - Search
│   ├── GET /api/vehicles/{id} - Get by ID
│   ├── POST /api/vehicles/{id}/assign - Assign driver
│   └── DELETE /api/vehicles/{id} - Delete
│
├── TripController.java
│   ├── @RestController
│   ├── CRUD operations for trips
│   ├── GET /api/trips/vehicle/{id}
│   └── GET /api/trips/driver/{id}
│
└── PageController.java
    ├── @Controller (returns HTML views)
    ├── GET / → dashboard
    ├── GET /drivers → driver list page
    ├── GET /drivers/new → add driver form
    ├── GET /drivers/{id} → driver details
    ├── GET /vehicles → vehicle list page
    ├── GET /vehicles/new → add vehicle form
    ├── GET /trips → trips list page
    └── GET /trips/new → create trip form
```

---

## 🎨 Frontend (HTML & CSS)

### HTML Templates (Thymeleaf)

```
src/main/resources/templates/
├── index.html
│   ├── Dashboard with 4 stat cards
│   ├── Recent activity table
│   ├── Quick action buttons
│   └── Navigation header & footer
│
├── drivers.html
│   ├── Drivers list table
│   ├── Search functionality
│   ├── Add driver button
│   └── Action buttons (View, Edit, Delete)
│
├── vehicles.html
│   ├── Vehicles grid layout (card view)
│   ├── Vehicle details per card
│   ├── Search functionality
│   └── Action buttons (View, Edit, Delete)
│
└── trips.html
    ├── Trips data table
    ├── Status badges
    ├── Update and delete operations
    └── Create new trip button
```

### CSS Styling

```
src/main/resources/static/css/
└── style.css (400+ lines)
    ├── CSS Variables for colors
    ├── Base styles & resets
    ├── Navigation bar
    ├── Dashboard grid
    ├── Tables
    ├── Forms
    ├── Buttons (primary, secondary, danger, warning)
    ├── Status badges (completed, ongoing, planned, idle, loading, in-transit)
    ├── Cards
    ├── Alerts
    ├── Responsive design (768px, 480px breakpoints)
    └── Animations (loading spinner, transitions)
```

---

## 📊 Database Schema

### Tables (Auto-created by JPA)

```
dvr_project/
├── drivers (5 columns + timestamps)
│   ├── id (BIGINT PK)
│   ├── name (VARCHAR 100 NOT NULL)
│   ├── phone (VARCHAR 20)
│   ├── current_location_lat (DOUBLE)
│   ├── current_location_lng (DOUBLE)
│   ├── current_place (VARCHAR 200)
│   ├── created_at (DATETIME)
│   └── updated_at (DATETIME)
│
├── vehicles (6 columns + timestamps + FK)
│   ├── id (BIGINT PK)
│   ├── number (VARCHAR 50 UNIQUE)
│   ├── model (VARCHAR 100)
│   ├── current_location (VARCHAR 200)
│   ├── destination (VARCHAR 200)
│   ├── status (ENUM)
│   ├── driver_id (BIGINT FK)
│   ├── created_at (DATETIME)
│   └── updated_at (DATETIME)
│
├── trips (8 columns + timestamps + FKs)
│   ├── id (BIGINT PK)
│   ├── vehicle_id (BIGINT FK NOT NULL)
│   ├── driver_id (BIGINT FK)
│   ├── from_location (VARCHAR 200)
│   ├── to_location (VARCHAR 200)
│   ├── cargo (VARCHAR 500)
│   ├── date (DATETIME)
│   ├── profit (DECIMAL 10,2)
│   ├── status (ENUM)
│   ├── created_at (DATETIME)
│   └── updated_at (DATETIME)
│
├── travel_history (5 columns + timestamp)
│   ├── id (BIGINT PK)
│   ├── driver_id (BIGINT FK NOT NULL)
│   ├── place_name (VARCHAR 200)
│   ├── latitude (DOUBLE)
│   ├── longitude (DOUBLE)
│   ├── note (VARCHAR 500)
│   └── timestamp (DATETIME)
│
└── vehicle_history (6 columns + created_at)
    ├── id (BIGINT PK)
    ├── vehicle_id (BIGINT FK NOT NULL)
    ├── from_location (VARCHAR 200)
    ├── to_location (VARCHAR 200)
    ├── cargo (VARCHAR 500)
    ├── profit (DECIMAL 10,2)
    ├── notes (VARCHAR 500)
    ├── journey_date (DATE)
    └── created_at (DATETIME)
```

---

## 🔄 API Endpoints Reference

### REST API Endpoints (JSON Responses)

**DRIVERS:**

- `POST /api/drivers` - Create new driver
- `GET /api/drivers` - List all drivers
- `GET /api/drivers?q=name` - Search by name
- `GET /api/drivers?place=city` - Search by place
- `GET /api/drivers/{id}` - Get driver by ID
- `POST /api/drivers/{id}/location` - Update location
- `DELETE /api/drivers/{id}` - Delete driver

**VEHICLES:**

- `POST /api/vehicles` - Create new vehicle
- `GET /api/vehicles` - List all vehicles
- `GET /api/vehicles/search?q=query` - Search vehicles
- `GET /api/vehicles/{id}` - Get vehicle by ID
- `POST /api/vehicles/{id}/assign` - Assign driver
- `DELETE /api/vehicles/{id}` - Delete vehicle

**TRIPS:**

- `POST /api/trips` - Create new trip
- `GET /api/trips` - List all trips
- `GET /api/trips/{id}` - Get trip by ID
- `GET /api/trips/vehicle/{id}` - Get trips for vehicle
- `GET /api/trips/driver/{id}` - Get trips for driver
- `PUT /api/trips/{id}` - Update trip status
- `DELETE /api/trips/{id}` - Delete trip

### Web Pages (HTML Responses)

- `GET /` - Dashboard
- `GET /drivers` - Drivers list page
- `GET /drivers/new` - Add driver form
- `GET /drivers/{id}` - Driver details page
- `GET /drivers/{id}/edit` - Edit driver form
- `GET /vehicles` - Vehicles list page
- `GET /vehicles/new` - Add vehicle form
- `GET /vehicles/{id}` - Vehicle details page
- `GET /trips` - Trips list page
- `GET /trips/new` - Create trip form

---

## 🔍 How to Find Things

### By Feature

- **Driver Management** → DriverRepository, DriverService, DriverController, drivers.html
- **Vehicle Management** → VehicleRepository, VehicleService, VehicleController, vehicles.html
- **Trip Tracking** → TripRepository, TripService, TripController, trips.html
- **Dashboard** → PageController, index.html
- **Styling** → style.css

### By Layer

- **Database Layer** → `repository/` package
- **Business Layer** → `service/` package
- **API Layer** → `controller/` package
- **Entity Layer** → `model/` package
- **View Layer** → `templates/` directory
- **Styling** → `static/css/` directory

### By Functionality

- **CRUD Operations** → Service classes
- **Search/Filter** → Repository @Query methods
- **Web Pages** → PageController + HTML templates
- **API Responses** → RestControllers
- **Database Config** → application.yml

---

## ✅ Checklist for Setup

- [ ] Read `JAVA_README.md`
- [ ] Install Java 11+
- [ ] Install Maven 3.6+
- [ ] Ensure MySQL is running
- [ ] Create `dvr_project` database
- [ ] Run `mvn clean package`
- [ ] Run `mvn spring-boot:run`
- [ ] Access http://localhost:8080
- [ ] Test all REST endpoints
- [ ] Test all web pages

---

## 📚 Documentation Overview

| Document                  | Content               | Read Time |
| ------------------------- | --------------------- | --------- |
| IMPLEMENTATION_SUMMARY.md | What was converted    | 10 min    |
| JAVA_README.md            | Setup & usage         | 15 min    |
| QUICK_REFERENCE.md        | Concepts & patterns   | 20 min    |
| JAVA_CONVERSION_GUIDE.md  | Detailed explanations | 30 min    |
| ANNOTATIONS_GUIDE.md      | Spring annotations    | 25 min    |
| FILE_INDEX.md             | This file             | 5 min     |

---

## 🎓 Learning Path

1. **Start:** `IMPLEMENTATION_SUMMARY.md` - Understand what was built
2. **Setup:** `JAVA_README.md` - Get application running
3. **Quick Ref:** `QUICK_REFERENCE.md` - Key concepts
4. **Details:** `JAVA_CONVERSION_GUIDE.md` - Deep dive
5. **Reference:** `ANNOTATIONS_GUIDE.md` - Lookup annotations

---

## 📞 Support Resources

- **Spring Boot Docs:** https://spring.io/projects/spring-boot
- **Spring Data JPA:** https://spring.io/projects/spring-data-jpa
- **Thymeleaf:** https://www.thymeleaf.org/
- **MySQL Docs:** https://dev.mysql.com/doc/
- **Maven:** https://maven.apache.org/

---

## 🎉 Next Steps

1. Get application running
2. Test all endpoints
3. Customize styling
4. Add authentication
5. Write unit tests
6. Deploy to production

---

_Happy coding! 🚀_
