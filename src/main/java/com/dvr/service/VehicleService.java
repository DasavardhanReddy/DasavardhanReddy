package com.dvr.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dvr.model.Driver;
import com.dvr.model.Vehicle;
import com.dvr.model.VehicleStatus;
import com.dvr.repository.DriverRepository;
import com.dvr.repository.VehicleRepository;


@Service
@Transactional
public class VehicleService {
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private DriverRepository driverRepository;
    
    /**
     * Create a new vehicle
     */
    public Vehicle createVehicle(Vehicle vehicle) {
        vehicle.setCreatedAt(LocalDateTime.now());
        vehicle.setUpdatedAt(LocalDateTime.now());
        return vehicleRepository.save(vehicle);
    }
    
    /**
     * Get all vehicles
     */
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }
    
    /**
     * Get vehicle by ID
     */
    public Optional<Vehicle> getVehicleById(Long id) {
        return vehicleRepository.findById(id);
    }
    
    
    public List<Vehicle> searchVehicles(String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }
        
        List<Vehicle> byNumber = vehicleRepository.findByNumberContainingIgnoreCase(query);
        
        
        List<Vehicle> byDriver = vehicleRepository.findByDriverNameContainingIgnoreCase(query);
        
        
        byNumber.addAll(byDriver);
        
        return byNumber.stream().distinct().collect(java.util.stream.Collectors.toList());
    }
    
    
    public Vehicle assignDriver(Long vehicleId, Long driverId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        
        Driver driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new RuntimeException("Driver not found"));
        
        vehicle.setDriver(driver);
        vehicle.setUpdatedAt(LocalDateTime.now());
        
        return vehicleRepository.save(vehicle);
    }
    
    /**
     * Update vehicle status
     */
    public Vehicle updateVehicleStatus(Long id, String status) {
        Vehicle vehicle = vehicleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        
        vehicle.setStatus(VehicleStatus.valueOf(status.toUpperCase()));
        vehicle.setUpdatedAt(LocalDateTime.now());
        
        return vehicleRepository.save(vehicle);
    }
    
    /**
     * Delete a vehicle
     */
    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }
}
