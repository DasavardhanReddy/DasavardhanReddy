package com.dvr.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * VehicleHistory Entity
 * 
 * Tracks historical trips/journeys made by a vehicle
 * Replaces the "history" array in MongoDB Vehicle model
 */
@Entity
@Table(name = "vehicle_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleHistory {
    
    /**
     * Primary key
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Many-to-One: Many history entries belong to one vehicle
     * When a vehicle is deleted, all its history is deleted (cascade)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;
    
    /**
     * Starting location
     */
    @Column(name = "from_location", length = 200)
    private String from;
    
    /**
     * Ending location
     */
    @Column(name = "to_location", length = 200)
    private String to;
    
    /**
     * Cargo description
     */
    @Column(length = 500)
    private String cargo;
    
    /**
     * Profit from this journey
     * Using BigDecimal for financial accuracy
     */
    @Column(precision = 10, scale = 2)
    private BigDecimal profit;
    
    /**
     * Additional notes
     */
    @Column(length = 500)
    private String notes;
    
    /**
     * Date of this journey
     */
    @Column(name = "journey_date")
    private LocalDate date;
    
    /**
     * When this record was created
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
