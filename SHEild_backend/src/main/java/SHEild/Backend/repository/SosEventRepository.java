package SHEild.Backend.repository;

import SHEild.Backend.entity.SosEvent;
import SHEild.Backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SosEventRepository extends JpaRepository<SosEvent, Long> {

    // Get all SOS events for a specific user
    List<SosEvent> findByUser(User user);

    // Get the latest active SOS event for a user
    Optional<SosEvent> findFirstByUserUserIdAndStatusOrderByStartedAtDesc(
            Long userId,
            String status
    );
}