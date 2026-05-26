package com.dvr.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * TravelHistory Entity
 * 
 * Tracks historical locations visited by a driver
 * Replaces the "travelHistory" array in MongoDB Driver model
 * In relational databases, arrays are stored as separate tables
 */
@Entity
@Table(name = "travel_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TravelHistory {

    /**
     * Primary key
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Many-to-One: Many travel history entries belong to one driver
     * When a driver is deleted, all their travel history is also deleted (cascade)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    /**
     * Place name (human-readable location)
     */
    @Column(name = "place_name", length = 200)
    private String placeName;

    /**
     * Latitude coordinate
     */
    @Column(name = "latitude")
    private Double latitude;

    /**
     * Longitude coordinate
     */
    @Column(name = "longitude")
    private Double longitude;

    /**
     * Optional note about this location
     */
    @Column(length = 500)
    private String note;

    /**
     * Timestamp when this location was recorded
     * Default is current time
     */
    @Column(name = "timestamp", nullable = false, updatable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}
