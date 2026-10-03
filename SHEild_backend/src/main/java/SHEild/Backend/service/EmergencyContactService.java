package SHEild.Backend.service;

import SHEild.Backend.entity.EmergencyContact;
import SHEild.Backend.entity.User;
import SHEild.Backend.repository.EmergencyContactRepository;
import SHEild.Backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmergencyContactService {

    private final EmergencyContactRepository contactRepository;
    private final UserRepository userRepository;

    public EmergencyContactService(
            EmergencyContactRepository contactRepository,
            UserRepository userRepository) {

        this.contactRepository = contactRepository;
        this.userRepository = userRepository;
    }

    public EmergencyContact addContact(Long userId, EmergencyContact contact) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        contact.setUser(user);

        return contactRepository.save(contact);
    }

    public List<EmergencyContact> getContacts(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        return contactRepository.findByUser(user);
    }

    public void deleteContact(Long userId, Long contactId) {

        EmergencyContact contact = contactRepository.findById(contactId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Contact not found"));

        if (!contact.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException(
                    "Contact does not belong to this user");
        }

        contactRepository.delete(contact);
    }
}