package com.dvr.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dvr.model.Vehicle;


@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    
    /**
     * Find vehicles by registration number (case-insensitive)
     * Replaces: Vehicle.find({ number: { $regex: q, $options: 'i' } })
     * @param number: Vehicle registration number
     * @return: List of matching vehicles
     */
    @Query("SELECT v FROM Vehicle v WHERE LOWER(v.number) LIKE LOWER(CONCAT('%', :number, '%'))")
    List<Vehicle> findByNumberContainingIgnoreCase(@Param("number") String number);
    
    /**
     * Find vehicles by driver name
     * Uses JOIN to search in related Driver records
     */
    @Query("SELECT v FROM Vehicle v JOIN v.driver d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :driverName, '%'))")
    List<Vehicle> findByDriverNameContainingIgnoreCase(@Param("driverName") String driverName);
    
    /**
     * Find vehicle by unique registration number
     */
    Optional<Vehicle> findByNumber(String number);
    
    /**
     * Find all vehicles assigned to a specific driver
     */
    List<Vehicle> findByDriverId(Long driverId);
    
    /**
     * Find vehicles by current status
     * Replaces: Vehicle.find({ status: 'idle' })
     */
    @Query("SELECT v FROM Vehicle v WHERE v.status = :status")
    List<Vehicle> findByStatus(@Param("status") String status);
}
