package SHEild.Backend.controller;

import SHEild.Backend.entity.SosEvent;
import SHEild.Backend.service.SosEventService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sos")
public class SosEventController {

    private final SosEventService sosEventService;

    public SosEventController(SosEventService sosEventService) {

        this.sosEventService = sosEventService;
    }

    // Trigger a new SOS
    @PostMapping("/{userId}")
    public ResponseEntity<SosEvent> triggerSos(
            @PathVariable Long userId,
            @RequestBody SosEvent sosEvent) {

        return ResponseEntity.ok(
                sosEventService.triggerSos(userId, sosEvent)
        );
    }

    // Get all SOS events for a user
    @GetMapping("/{userId}")
    public ResponseEntity<List<SosEvent>> getUserSosEvents(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                sosEventService.getUserSosEvents(userId)
        );
    }

    // Get the currently active SOS for a user
    @GetMapping("/{userId}/active")
    public ResponseEntity<SosEvent> getActiveSos(
            @PathVariable Long userId) {

        SosEvent activeSos = sosEventService.getActiveSos(userId);

        if (activeSos == null) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(activeSos);
    }

    // End an SOS
    @PutMapping("/{userId}/{sosId}/end")
    public ResponseEntity<SosEvent> endSos(
            @PathVariable Long userId,
            @PathVariable Long sosId,
            @RequestParam(defaultValue = "RESOLVED") String status) {

        return ResponseEntity.ok(
                sosEventService.endSos(userId, sosId, status)
        );
    }
}