package com.dvr.repository;

import com.dvr.model.TravelHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * TravelHistoryRepository
 */
@Repository
public interface TravelHistoryRepository extends JpaRepository<TravelHistory, Long> {
    List<TravelHistory> findByDriverId(Long driverId);
}
