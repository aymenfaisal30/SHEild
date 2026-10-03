package SHEild.Backend.controller;

import SHEild.Backend.entity.EmergencyContact;
import SHEild.Backend.service.EmergencyContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency-contacts")
public class EmergencyContactController {

    private final EmergencyContactService contactService;

    public EmergencyContactController(
            EmergencyContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<EmergencyContact> addContact(
            @PathVariable Long userId,
            @RequestBody EmergencyContact contact) {

        return ResponseEntity.ok(
                contactService.addContact(userId, contact)
        );
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<EmergencyContact>> getContacts(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                contactService.getContacts(userId)
        );
    }

    @DeleteMapping("/{userId}/{contactId}")
    public ResponseEntity<Void> deleteContact(
            @PathVariable Long userId,
            @PathVariable Long contactId) {

        contactService.deleteContact(userId, contactId);

        return ResponseEntity.noContent().build();
    }
}
