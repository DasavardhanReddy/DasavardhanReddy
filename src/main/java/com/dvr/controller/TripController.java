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
import org.springframework.web.bind.annotation.RestController;

import com.dvr.model.Trip;
import com.dvr.service.TripService;

/**
 * TripController
 * 
 * REST API endpoints for Trip operations
 */
@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "*")
public class TripController {
    
    @Autowired
    private TripService tripService;
    
    /**
     * POST /api/trips
     * Create a new trip
     */
    @PostMapping
    public ResponseEntity<Trip> createTrip(@RequestBody Trip trip) {
        try {
            Trip createdTrip = tripService.createTrip(trip);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTrip);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    /**
     * GET /api/trips
     * Get all trips
     */
    @GetMapping
    public ResponseEntity<List<Trip>> getAllTrips() {
        List<Trip> trips = tripService.getAllTrips();
        return ResponseEntity.ok(trips);
    }
    
    /**
     * GET /api/trips/{id}
     * Get trip by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable Long id) {
        Optional<Trip> trip = tripService.getTripById(id);
        
        if (trip.isPresent()) {
            return ResponseEntity.ok(trip.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * GET /api/trips/vehicle/{vehicleId}
     * Get trips for a specific vehicle
     */
    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<Trip>> getTripsByVehicle(@PathVariable Long vehicleId) {
        List<Trip> trips = tripService.getTripsByVehicle(vehicleId);
        return ResponseEntity.ok(trips);
    }
    
    /**
     * GET /api/trips/driver/{driverId}
     * Get trips for a specific driver
     */
    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<Trip>> getTripsByDriver(@PathVariable Long driverId) {
        List<Trip> trips = tripService.getTripsByDriver(driverId);
        return ResponseEntity.ok(trips);
    }
    
    /**
     * PUT /api/trips/{id}
     * Update trip status
     */
    @PutMapping("/{id}")
    public ResponseEntity<Trip> updateTripStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {
        try {
            Trip updatedTrip = tripService.updateTripStatus(id, request.getStatus());
            return ResponseEntity.ok(updatedTrip);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * DELETE /api/trips/{id}
     * Delete a trip
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return ResponseEntity.noContent().build();
    }
}

/**
 * DTO for updating trip status
 */
class StatusUpdateRequest {
    private String status;
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
