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

import com.dvr.model.Vehicle;
import com.dvr.service.VehicleService;


@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "*")
public class VehicleController {
    
    @Autowired
    private VehicleService vehicleService;
    
    /**
     * POST /api/vehicles
     * Create a new vehicle
     */
    @PostMapping
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {
        try {
            Vehicle createdVehicle = vehicleService.createVehicle(vehicle);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdVehicle);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    /**
     * GET /api/vehicles/search
     * Search vehicles by registration number or driver name
     * 
     * Query parameter: q (search term)
     * Response: List of matching vehicles
     * 
     * Replaces: router.get('/search', async (req, res) => ...)
     */
    @GetMapping("/search")
    public ResponseEntity<List<Vehicle>> searchVehicles(
            @RequestParam(required = false) String q) {
        List<Vehicle> vehicles = vehicleService.searchVehicles(q);
        return ResponseEntity.ok(vehicles);
    }
    
    /**
     * GET /api/vehicles
     * Get all vehicles
     * 
     * Replaces: router.get('/all', async (req, res) => ...)
     */
    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        List<Vehicle> vehicles = vehicleService.getAllVehicles();
        return ResponseEntity.ok(vehicles);
    }
    
    /**
     * GET /api/vehicles/{id}
     * Get vehicle by ID
     * 
     * Replaces: router.get('/:id', async (req, res) => ...)
     */
    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        Optional<Vehicle> vehicle = vehicleService.getVehicleById(id);
        
        if (vehicle.isPresent()) {
            return ResponseEntity.ok(vehicle.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * POST /api/vehicles/{id}/assign
     * Assign a driver to a vehicle
     * 
     * Request body: { "driverId": 1 }
     */
    @PostMapping("/{id}/assign")
    public ResponseEntity<Vehicle> assignDriver(
            @PathVariable Long id,
            @RequestBody AssignDriverRequest request) {
        try {
            Vehicle vehicle = vehicleService.assignDriver(id, request.getDriverId());
            return ResponseEntity.ok(vehicle);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * PUT /api/vehicles/{id}
     * Update vehicle
     */
    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(
            @PathVariable Long id,
            @RequestBody Vehicle vehicleUpdate) {
        try {
            Optional<Vehicle> existingVehicle = vehicleService.getVehicleById(id);
            
            if (existingVehicle.isPresent()) {
                Vehicle vehicle = existingVehicle.get();
                
                // Update fields
                if (vehicleUpdate.getModel() != null) {
                    vehicle.setModel(vehicleUpdate.getModel());
                }
                if (vehicleUpdate.getCurrentLocation() != null) {
                    vehicle.setCurrentLocation(vehicleUpdate.getCurrentLocation());
                }
                if (vehicleUpdate.getDestination() != null) {
                    vehicle.setDestination(vehicleUpdate.getDestination());
                }
                if (vehicleUpdate.getStatus() != null) {
                    vehicle.setStatus(vehicleUpdate.getStatus());
                }
                
                Vehicle updated = vehicleService.createVehicle(vehicle);
                return ResponseEntity.ok(updated);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * DELETE /api/vehicles/{id}
     * Delete a vehicle
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}

/**
 * Request DTO for assigning driver to vehicle
 */
class AssignDriverRequest {
    private Long driverId;
    
    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }
}
