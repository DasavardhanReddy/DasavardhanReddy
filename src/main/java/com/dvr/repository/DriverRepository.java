package com.dvr.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dvr.model.Driver;


@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    
    /**
     * Find drivers by name (case-insensitive search)
     * Uses LIKE for SQL pattern matching
     * LOWER() makes it case-insensitive
     * @param name: Search term
     * @return: List of matching drivers
     */
    @Query("SELECT d FROM Driver d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Driver> findByNameContainingIgnoreCase(@Param("name") String name);
    
    /**
     * Find drivers by current place (case-insensitive)
     * Replaces MongoDB place search
     */
    @Query("SELECT d FROM Driver d WHERE LOWER(d.currentPlace) LIKE LOWER(CONCAT('%', :place, '%'))")
    List<Driver> findByCurrentPlaceContainingIgnoreCase(@Param("place") String place);
    
    /**
     * Find drivers who have visited a specific place in travel history
     * Uses JOIN to search in related TravelHistory records
     */
    @Query("SELECT DISTINCT d FROM Driver d " +
           "JOIN d.travelHistory th " +
           "WHERE LOWER(th.placeName) LIKE LOWER(CONCAT('%', :place, '%'))")
    List<Driver> findByTravelHistoryPlaceContainingIgnoreCase(@Param("place") String place);
    
    /**
     * Find driver by ID (optional - wraps the result)
     * Different from Mongoose where null is returned
     */
    Optional<Driver> findById(Long id);
}
