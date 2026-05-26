package com.dvr.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dvr.model.Driver;
import com.dvr.model.TravelHistory;
import com.dvr.repository.DriverRepository;
import com.dvr.repository.TravelHistoryRepository;


@Service
@Transactional
public class DriverService {
    
    /**
     * @Autowired: Spring automatically injects the repository
     * This replaces: const Driver = require('../models/Driver');
     */
    @Autowired
    private DriverRepository driverRepository;
    
    @Autowired
    private TravelHistoryRepository travelHistoryRepository;
    
    /**
     * Create a new driver
     * Replaces: router.post('/', async (req, res) => ...)
     * @param driver: Driver object with name and phone
     * @return: Saved driver with generated ID
     */
    public Driver createDriver(Driver driver) {
        // Set initial values
        driver.setCreatedAt(LocalDateTime.now());
        driver.setUpdatedAt(LocalDateTime.now());
        return driverRepository.save(driver);
    }
    
    /**
     * Get all drivers
     * Optionally filter by name or place
     * Replaces: router.get('/', async (req, res) => ...)
     */
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }
    
    /**
     * Search drivers by place
     * Searches both currentPlace and travelHistory
     */
    public List<Driver> searchByPlace(String place) {
        return driverRepository.findByCurrentPlaceContainingIgnoreCase(place);
    }
    
    /**
     * Search drivers by name
     */
    public List<Driver> searchByName(String name) {
        return driverRepository.findByNameContainingIgnoreCase(name);
    }
    
    /**
     * Get driver by ID
     * @param id: Driver ID
     * @return: Optional containing driver or empty if not found
     */
    public Optional<Driver> getDriverById(Long id) {
        return driverRepository.findById(id);
    }
    
    /**
     * Update driver location and add travel history
     * Replaces: router.post('/:id/location', async (req, res) => ...)
     * 
     * @param id: Driver ID
     * @param lat: Latitude
     * @param lng: Longitude
     * @param placeName: Human-readable place name
     * @param note: Optional note
     * @return: Updated driver
     * @throws: RuntimeException if driver not found
     */
    public Driver updateDriverLocation(Long id, Double lat, Double lng, String placeName, String note) {
        Driver driver = driverRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Driver not found with id: " + id));
        
        // Update current location
        driver.setCurrentLocationLat(lat);
        driver.setCurrentLocationLng(lng);
        driver.setCurrentPlace(placeName);
        driver.setUpdatedAt(LocalDateTime.now());
        
        // Add to travel history
        TravelHistory history = new TravelHistory();
        history.setDriver(driver);
        history.setLatitude(lat);
        history.setLongitude(lng);
        history.setPlaceName(placeName);
        history.setNote(note);
        history.setTimestamp(LocalDateTime.now());
        
        travelHistoryRepository.save(history);
        
        return driverRepository.save(driver);
    }
    
    /**
     * Update a driver
     */
    public Driver updateDriver(Driver driver) {
        driver.setUpdatedAt(LocalDateTime.now());
        return driverRepository.save(driver);
    }
    
    /**
     * Delete a driver
     * @param id: Driver ID
     */
    public void deleteDriver(Long id) {
        driverRepository.deleteById(id);
    }
}
