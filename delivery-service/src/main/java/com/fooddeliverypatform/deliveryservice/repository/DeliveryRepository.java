package com.fooddeliverypatform.deliveryservice.repository;



import com.fooddeliverypatform.deliveryservice.model.Delivery;
import com.fooddeliverypatform.deliveryservice.model.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

    Optional<Delivery> findByOrderId(Long orderId);

    List<Delivery> findByDriverId(Long driverId);

    List<Delivery> findByStatus(DeliveryStatus status);

    List<Delivery> findByDriverIdAndStatus(Long driverId, DeliveryStatus status);

    boolean existsByOrderId(Long orderId);
}
