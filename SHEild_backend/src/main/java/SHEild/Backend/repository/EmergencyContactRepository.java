package SHEild.Backend.repository;

import SHEild.Backend.entity.EmergencyContact;
import SHEild.Backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmergencyContactRepository
        extends JpaRepository<EmergencyContact, Long> {

    List<EmergencyContact> findByUser(User user);

    Optional<EmergencyContact> findFirstByUserUserIdAndIsPrimary(
            Long userId,
            Boolean isPrimary
    );
}