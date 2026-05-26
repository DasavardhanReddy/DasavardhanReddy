-- DVR Project - MySQL Database Setup Script
-- Run this script in MySQL to create the database and tables
-- Tables will be created by Hibernate on first application run
-- But you can use this for reference

-- Create database
CREATE DATABASE IF NOT EXISTS dvr_project;

USE dvr_project;

-- Enable foreign key support
SET FOREIGN_KEY_CHECKS = 1;

-- Drivers table
CREATE TABLE IF NOT EXISTS drivers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    current_location_lat DOUBLE,
    current_location_lng DOUBLE,
    current_place VARCHAR(200),
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    INDEX idx_name (name),
    INDEX idx_place (current_place)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    number VARCHAR(50) NOT NULL UNIQUE,
    model VARCHAR(100),
    current_location VARCHAR(200),
    destination VARCHAR(200),
    status VARCHAR(50),
    driver_id BIGINT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    CONSTRAINT fk_vehicle_driver FOREIGN KEY (driver_id) REFERENCES drivers (id),
    INDEX idx_number (number),
    INDEX idx_status (status),
    INDEX idx_driver (driver_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    driver_id BIGINT,
    from_location VARCHAR(200),
    to_location VARCHAR(200),
    cargo VARCHAR(500),
    date DATETIME NOT NULL,
    profit DECIMAL(10, 2),
    status VARCHAR(50),
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    CONSTRAINT fk_trip_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles (id),
    CONSTRAINT fk_trip_driver FOREIGN KEY (driver_id) REFERENCES drivers (id),
    INDEX idx_vehicle (vehicle_id),
    INDEX idx_driver (driver_id),
    INDEX idx_status (status),
    INDEX idx_date (date)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Travel History table
CREATE TABLE IF NOT EXISTS travel_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    driver_id BIGINT NOT NULL,
    latitude DOUBLE,
    longitude DOUBLE,
    place_name VARCHAR(200),
    note VARCHAR(500),
    timestamp DATETIME,
    CONSTRAINT fk_travel_driver FOREIGN KEY (driver_id) REFERENCES drivers (id),
    INDEX idx_driver (driver_id),
    INDEX idx_timestamp (timestamp)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Vehicle History table
CREATE TABLE IF NOT EXISTS vehicle_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    status VARCHAR(50),
    location VARCHAR(200),
    note VARCHAR(500),
    timestamp DATETIME,
    CONSTRAINT fk_vhistory_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles (id),
    INDEX idx_vehicle (vehicle_id),
    INDEX idx_timestamp (timestamp)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Verify tables were created
SHOW TABLES;

-- Sample data (optional - for testing)
-- INSERT INTO drivers (name, phone, created_at, updated_at)
-- VALUES ('John Doe', '9876543210', NOW(), NOW());
-- INSERT INTO vehicles (number, model, status, driver_id, created_at, updated_at)
-- VALUES ('MH-01-AB-1234', 'Truck', 'IDLE', 1, NOW(), NOW());

-- Check tables
SELECT 'Drivers' as table_name, COUNT(*) as row_count
FROM drivers
UNION ALL
SELECT 'Vehicles', COUNT(*)
FROM vehicles
UNION ALL
SELECT 'Trips', COUNT(*)
FROM trips
UNION ALL
SELECT 'Travel History', COUNT(*)
FROM travel_history
UNION ALL
SELECT 'Vehicle History', COUNT(*)
FROM vehicle_history;