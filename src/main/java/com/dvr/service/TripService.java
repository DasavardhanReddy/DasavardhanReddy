package com.dvr.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dvr.model.Trip;
import com.dvr.model.TripStatus;
import com.dvr.repository.DriverRepository;
import com.dvr.repository.TripRepository;
import com.dvr.repository.VehicleRepository;


@Service
@Transactional
public class TripService {
    
    @Autowired
    private TripRepository tripRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private DriverRepository driverRepository;
    
    
    public Trip createTrip(Trip trip) {
        trip.setCreatedAt(LocalDateTime.now());
        trip.setUpdatedAt(LocalDateTime.now());
        if (trip.getDate() == null) {
            trip.setDate(LocalDateTime.now());
        }
        return tripRepository.save(trip);
    }
    
    /**
     * Get all trips
     */
    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }
    
    /**
     * Get trip by ID
     */
    public Optional<Trip> getTripById(Long id) {
        return tripRepository.findById(id);
    }
    
    /**
     * Get trips for a specific vehicle
     */
    public List<Trip> getTripsByVehicle(Long vehicleId) {
        return tripRepository.findByVehicleId(vehicleId);
    }
    
    /**
     * Get trips driven by a specific driver
     */
    public List<Trip> getTripsByDriver(Long driverId) {
        return tripRepository.findByDriverId(driverId);
    }
    
    /**
     * Update trip status
     */
    public Trip updateTripStatus(Long id, String status) {
        Trip trip = tripRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Trip not found"));
        
        trip.setStatus(TripStatus.valueOf(status.toUpperCase()));
        trip.setUpdatedAt(LocalDateTime.now());
        
        return tripRepository.save(trip);
    }
    
    /**
     * Delete a trip
     */
    public void deleteTrip(Long id) {
        tripRepository.deleteById(id);
    }
}
