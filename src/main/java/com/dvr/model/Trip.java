package com.dvr.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Trip Entity - Replaces MongoDB Trip model
 * 
 * Represents a single trip made by a vehicle and driver.
 * Tracks journey details including route, cargo, and profit.
 */
@Entity
@Table(name = "trips")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Trip {

    /**
     * Primary key - auto-generated
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Many-to-One: A trip belongs to one vehicle
     * 
     * @JoinColumn creates foreign key column "vehicle_id"
     *             nullable = false means every trip MUST have a vehicle
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    /**
     * Many-to-One: A trip is driven by one driver
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "driver_id")
    private Driver driver;

    /**
     * Starting location (city/place name)
     */
    @Column(name = "from_location", length = 200)
    private String from;

    /**
     * Ending location (city/place name)
     */
    @Column(name = "to_location", length = 200)
    private String to;

    /**
     * Description of cargo/goods
     */
    @Column(length = 500)
    private String cargo;

    /**
     * Trip date and time
     * Default is current time
     */
    @Column(nullable = false)
    private LocalDateTime date = LocalDateTime.now();

    /**
     * Profit earned from this trip
     * Using BigDecimal for financial calculations (more accurate than Double)
     */
    @Column(precision = 10, scale = 2)
    private BigDecimal profit;

    /**
     * Trip status: planned, ongoing, completed
     */
    @Column(length = 50)
    @Enumerated(EnumType.STRING)
    private TripStatus status = TripStatus.PLANNED;

    /**
     * Creation timestamp
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Last update timestamp
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (date == null) {
            date = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
