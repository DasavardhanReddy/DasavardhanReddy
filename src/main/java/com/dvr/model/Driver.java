package com.dvr.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Driver Entity - Replaces MongoDB Driver model
 * 
 * This class represents a driver in the DVR system.
 * - @Entity: Marks this as a JPA entity (database table)
 * - @Table: Specifies the table name
 * - Lombok annotations reduce boilerplate:
 *   @Data: Generates getters, setters, toString, equals, hashCode
 *   @NoArgsConstructor: Generates default constructor
 *   @AllArgsConstructor: Generates constructor with all fields
 */
@Entity
@Table(name = "drivers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Driver {
    
    /**
     * Primary key - auto-generated
     * IDENTITY strategy means MySQL generates the ID (auto_increment)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Driver name
     * nullable = false means this field cannot be NULL in the database
     */
    @Column(nullable = false, length = 100)
    private String name;
    
    /**
     * Driver phone number
     */
    @Column(length = 20)
    private String phone;
    
    /**
     * Current location latitude
     * Used for storing GPS coordinates
     */
    @Column(name = "current_location_lat")
    private Double currentLocationLat;
    
    /**
     * Current location longitude
     */
    @Column(name = "current_location_lng")
    private Double currentLocationLng;
    
    /**
     * Human-readable current location (place name)
     */
    @Column(name = "current_place", length = 200)
    private String currentPlace;
    
    /**
     * One-to-Many relationship: A driver can have many vehicles
     * FetchType.LAZY: Don't automatically load vehicles when loading a driver
     *                 (prevents N+1 query problem)
     * cascade: Operations on Driver cascade to Vehicles
     * mappedBy: "driver" means Vehicle.driver field owns this relationship
     */
    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Vehicle> assignedVehicles;
    
    /**
     * One-to-Many relationship: A driver has many travel history entries
     */
    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TravelHistory> travelHistory;
    
    /**
     * Timestamp when record was created
     * updateable = false means this won't change after creation
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    /**
     * Timestamp when record was last updated
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * JPA lifecycle callback - runs before saving a new record
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    /**
     * JPA lifecycle callback - runs before updating a record
     */
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
