# Quick Start Guide - DVR Vehicle Management System

## 📋 Prerequisites

- **Java 11+** installed
- **MySQL Server** running (on port 3309 or 3306)
- **Maven 3.6+** (if building from terminal)
- **VS Code** or any Java IDE

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Verify MySQL is Running

Open Command Prompt and test MySQL connection:

```cmd
mysql -h localhost -P 3309 -u root -p
```

If using port 3306 (default):

```cmd
mysql -h localhost -u root -p
```

Password: `Dasav@7173`

If this fails, MySQL is not running or credentials are wrong.

### Step 2: Update Database Configuration (if needed)

Edit `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3309/dvr_project # Change port if needed
    username: root # Your MySQL username
    password: Dasav@7173 # Your MySQL password
```

### Step 3: Run the Application

#### Using IDE (Easiest):

1. Open project in VS Code/IDE
2. Open `src/main/java/com/dvr/DvrApplication.java`
3. Right-click → **Run** or press **F5**

#### Using Terminal:

```cmd
cd c:\sample_project\mavenproject\DVR_PROJECT
mvn clean spring-boot:run
```

#### Using Built JAR:

```cmd
mvn clean package
java -jar target/dvr-project-1.0.0.jar
```

### Step 4: Access the Application

Open browser: **http://localhost:8080**

You should see the Dashboard with menu options.

---

## ✅ Verify Everything Works

### Test 1: Create a Driver

1. Click **Drivers** → **Add New Driver**
2. Enter:
   - Name: `Test Driver`
   - Phone: `9999999999`
3. Click **Add Driver**
4. ✅ You should see: "Driver added successfully!"
5. ✅ New driver appears in the list

### Test 2: Verify Data in MySQL

Open MySQL:

```bash
mysql -h localhost -P 3309 -u root -p
```

Then:

```sql
USE dvr_project;
SELECT * FROM drivers;  -- Should see your test driver
```

If you see the driver, **everything is working!** ✅

---

## 🆘 Common Issues & Solutions

| Issue                                       | Solution                                                                                                     |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Port 3309: Connection refused               | MySQL not running OR port is 3306. Change `application.yml` url to `jdbc:mysql://localhost:3306/dvr_project` |
| Access denied for user 'root'               | Wrong password. Verify in `application.yml`. Default: `Dasav@7173`                                           |
| "database dvr_project not found"            | Run application once to auto-create. Hibernate will create it.                                               |
| "Table 'dvr_project.drivers' doesn't exist" | Same as above. Run app once.                                                                                 |
| Form submission fails silently              | Open Browser DevTools (F12) → Console to see errors                                                          |
| Cannot compile/build                        | Make sure Java 11+ is installed. Run `java -version` in terminal                                             |

---

## 📚 Full Feature Testing

### Add Vehicles

1. Drivers → Add New Driver (create "John")
2. Vehicles → Add New Vehicle
   - Number: `MH-01-AB-1234`
   - Model: `Truck`
   - Status: `IDLE`
   - Assign Driver: Select "John"
3. Submit

### Create Trips

1. Trips → Create New Trip
   - Vehicle: Select the truck
   - Driver: Select John
   - From: `Mumbai`
   - To: `Pune`
   - Cargo: `Electronics`
   - Profit: `5000`
2. Submit

### View Data

- Dashboard shows total drivers, vehicles, active trips
- Each section shows all records
- Click on individual records for details

---

## 📡 API Testing (For Developers)

### Using cURL in PowerShell

#### Create Driver:

```powershell
$headers = @{"Content-Type"="application/json"}
$body = @{name="Jane"; phone="8888888888"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8080/api/drivers" -Method POST -Headers $headers -Body $body
```

#### Get All Drivers:

```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/drivers" -Method GET
```

#### Using Postman (Recommended):

1. Download [Postman](https://www.postman.com/download/)
2. Set request to **POST**
3. URL: `http://localhost:8080/api/drivers`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):

```json
{
  "name": "Bob",
  "phone": "7777777777"
}
```

6. Click **Send**

---

## 🔧 Advanced Configuration

### Change Server Port

Edit `application.yml`:

```yaml
server:
  port: 8000 # Change from 8080 to 8000
```

### Enable Debug Logging

Edit `application.yml`:

```yaml
logging:
  level:
    root: DEBUG
    com.dvr: DEBUG
```

### Change Database

Edit `application.yml`:

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: create # create=drop & recreate | update=auto-update | validate=check only
```

---

## 📞 If Something Still Doesn't Work

1. **Check Application Logs** (bottom of IDE)
   - Look for red error messages
   - Note the exact error

2. **Check Browser Console** (F12 → Console)
   - JavaScript errors?
   - Network tab → Check API responses

3. **Verify MySQL Database**

```sql
SHOW DATABASES;  -- See all databases
USE dvr_project;
SHOW TABLES;     -- See all tables
DESC drivers;    -- See table structure
```

4. **Restart Everything**
   - Stop application
   - Stop MySQL
   - Start MySQL
   - Start application

---

## 📝 Project Structure

```
DVR_PROJECT/
├── src/main/java/com/dvr/
│   ├── DvrApplication.java           ← Main entry point
│   ├── controller/                   ← HTTP endpoints
│   │   ├── PageController.java       ← Page serving
│   │   ├── DriverController.java     ← Driver API
│   │   ├── VehicleController.java    ← Vehicle API
│   │   └── TripController.java       ← Trip API
│   ├── service/                      ← Business logic
│   ├── model/                        ← Database entities
│   └── repository/                   ← Database access
├── src/main/resources/
│   ├── application.yml               ← Configuration ⚙️
│   ├── templates/                    ← HTML pages
│   └── static/css/                   ← Styles
├── pom.xml                           ← Dependencies
└── target/                           ← Compiled code
```

---

## 🎯 Next Steps

1. ✅ Complete the Quick Setup above
2. ✅ Run the application
3. ✅ Test all 3 features (Driver, Vehicle, Trip)
4. ✅ Check MySQL database for data
5. ✅ Done! Your DVR system is working!

**Happy vehicle management! 🚗**
