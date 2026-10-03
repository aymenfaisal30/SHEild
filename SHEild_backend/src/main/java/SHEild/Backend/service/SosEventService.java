package SHEild.Backend.service;

import SHEild.Backend.entity.SosEvent;
import SHEild.Backend.entity.User;
import SHEild.Backend.repository.SosEventRepository;
import SHEild.Backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SosEventService {

    private final SosEventRepository sosEventRepository;
    private final UserRepository userRepository;

    public SosEventService(
            SosEventRepository sosEventRepository,
            UserRepository userRepository) {

        this.sosEventRepository = sosEventRepository;
        this.userRepository = userRepository;
    }

    // Trigger a new SOS
    public SosEvent triggerSos(Long userId, SosEvent sosEvent) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        // Check if the user already has an active SOS
        boolean activeSosExists = sosEventRepository
                .findFirstByUserUserIdAndStatusOrderByStartedAtDesc(
                        userId,
                        "ACTIVE"
                )
                .isPresent();

        if (activeSosExists) {
            throw new IllegalArgumentException(
                    "User already has an active SOS"
            );
        }

        sosEvent.setUser(user);
        sosEvent.setStatus("ACTIVE");

        return sosEventRepository.save(sosEvent);
    }

    // Get all SOS events for a user
    public List<SosEvent> getUserSosEvents(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        return sosEventRepository.findByUser(user);
    }

    // Get the currently active SOS for a user
    public SosEvent getActiveSos(Long userId) {

        userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        return sosEventRepository
                .findFirstByUserUserIdAndStatusOrderByStartedAtDesc(
                        userId,
                        "ACTIVE"
                )
                .orElse(null);
    }

    // End an SOS
    public SosEvent endSos(Long userId, Long sosId, String status) {

        // The database only accepts RESOLVED or CANCELLED as final states
        if (!status.equals("RESOLVED") && !status.equals("CANCELLED")) {
            throw new IllegalArgumentException("Status must be RESOLVED or CANCELLED");
        }

        SosEvent sosEvent = sosEventRepository.findById(sosId)
                .orElseThrow(() ->
                        new IllegalArgumentException("SOS event not found"));

        if (!sosEvent.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException(
                    "SOS event does not belong to this user");
        }

        sosEvent.setStatus(status);
        sosEvent.setEndedAt(LocalDateTime.now());

        return sosEventRepository.save(sosEvent);
    }
}