package com.dvr.model;

/**
 * Enum for vehicle status values
 * Using enum ensures only valid status values can be stored
 * This replaces the MongoDB enum validation
 */
public enum VehicleStatus {
    IDLE,
    LOADING,
    IN_TRANSIT
}
