package com.dvr.repository;

import com.dvr.model.VehicleHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * VehicleHistoryRepository
 */
@Repository
public interface VehicleHistoryRepository extends JpaRepository<VehicleHistory, Long> {
    List<VehicleHistory> findByVehicleId(Long vehicleId);
}
