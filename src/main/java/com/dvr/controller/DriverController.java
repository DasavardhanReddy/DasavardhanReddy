package com.dvr.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dvr.model.Driver;
import com.dvr.service.DriverService;


@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "*") // Allow requests from frontend (during development)
public class DriverController {
    
    @Autowired
    private DriverService driverService;
    
    /**
     * POST /api/drivers
     * Create a new driver
     * 
     * Request body: { "name": "John", "phone": "9876543210" }
     * Response: 201 Created with driver details
     * 
     * Replaces: router.post('/', async (req, res) => ...)
     */
    @PostMapping
    public ResponseEntity<Driver> createDriver(@RequestBody Driver driver) {
        try {
            Driver createdDriver = driverService.createDriver(driver);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDriver);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    /**
     * GET /api/drivers
     * List all drivers, optionally search by place or name
     * 
     * Query parameters:
     * - place: Search by location
     * - q: Search by name
     * 
     * Response: 200 OK with list of drivers
     * 
     * Replaces: router.get('/', async (req, res) => ...)
     */
    @GetMapping
    public ResponseEntity<List<Driver>> getAllDrivers(
            @RequestParam(required = false) String place,
            @RequestParam(required = false) String q) {
        
        List<Driver> drivers;
        
        if (place != null && !place.isEmpty()) {
            drivers = driverService.searchByPlace(place);
        } else if (q != null && !q.isEmpty()) {
            drivers = driverService.searchByName(q);
        } else {
            drivers = driverService.getAllDrivers();
        }
        
        return ResponseEntity.ok(drivers);
    }
    
    /**
     * GET /api/drivers/{id}
     * Get driver by ID
     * 
     * Path parameter: id (driver ID)
     * Response: 200 OK or 404 Not Found
     * 
     * Replaces: router.get('/:id', async (req, res) => ...)
     */
    @GetMapping("/{id}")
    public ResponseEntity<Driver> getDriverById(@PathVariable Long id) {
        Optional<Driver> driver = driverService.getDriverById(id);
        
        if (driver.isPresent()) {
            return ResponseEntity.ok(driver.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * POST /api/drivers/{id}/location
     * Update driver's current location and add travel history
     * 
     * Request body: { "lat": 19.07, "lng": 72.88, "placeName": "Mumbai", "note": "Reached warehouse" }
     * Response: 200 OK with updated driver
     * 
     * Replaces: router.post('/:id/location', async (req, res) => ...)
     */
    @PostMapping("/{id}/location")
    public ResponseEntity<Driver> updateDriverLocation(
            @PathVariable Long id,
            @RequestBody LocationUpdateRequest request) {
        try {
            Driver updatedDriver = driverService.updateDriverLocation(
                id,
                request.getLat(),
                request.getLng(),
                request.getPlaceName(),
                request.getNote()
            );
            return ResponseEntity.ok(updatedDriver);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * PUT /api/drivers/{id}
     * Update driver
     */
    @PutMapping("/{id}")
    public ResponseEntity<Driver> updateDriver(
            @PathVariable Long id,
            @RequestBody Driver driverUpdate) {
        try {
            Optional<Driver> existingDriver = driverService.getDriverById(id);
            
            if (existingDriver.isPresent()) {
                Driver driver = existingDriver.get();
                if (driverUpdate.getName() != null) {
                    driver.setName(driverUpdate.getName());
                }
                if (driverUpdate.getPhone() != null) {
                    driver.setPhone(driverUpdate.getPhone());
                }
                Driver updated = driverService.updateDriver(driver);
                return ResponseEntity.ok(updated);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * DELETE /api/drivers/{id}
     * Delete a driver
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDriver(@PathVariable Long id) {
        driverService.deleteDriver(id);
        return ResponseEntity.noContent().build();
    }
}

/**
 * Request body DTO (Data Transfer Object) for location update
 * Replaces destructuring in Node.js: const { lat, lng, placeName, note } = req.body;
 */
class LocationUpdateRequest {
    private Double lat;
    private Double lng;
    private String placeName;
    private String note;
    
    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }
    
    public Double getLng() { return lng; }
    public void setLng(Double lng) { this.lng = lng; }
    
    public String getPlaceName() { return placeName; }
    public void setPlaceName(String placeName) { this.placeName = placeName; }
    
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
