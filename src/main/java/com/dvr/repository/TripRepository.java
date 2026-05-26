package com.dvr.repository;

import com.dvr.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

/**
 * TripRepository Interface
 * 
 * Database operations for Trip entity
 */
@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    
    /**
     * Find all trips for a specific vehicle
     */
    List<Trip> findByVehicleId(Long vehicleId);
    
    /**
     * Find all trips driven by a specific driver
     */
    List<Trip> findByDriverId(Long driverId);
    
    /**
     * Find trips by status (planned, ongoing, completed)
     */
    @Query("SELECT t FROM Trip t WHERE t.status = :status")
    List<Trip> findByStatus(@Param("status") String status);
    
    /**
     * Find trips completed between two dates
     * Useful for generating reports
     */
    @Query("SELECT t FROM Trip t WHERE t.date BETWEEN :startDate AND :endDate")
    List<Trip> findTripsBetweenDates(@Param("startDate") LocalDateTime startDate, 
                                     @Param("endDate") LocalDateTime endDate);
}
