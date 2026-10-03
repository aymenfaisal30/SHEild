package SHEild.Backend.controller;

import SHEild.Backend.entity.User;
import SHEild.Backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import SHEild.Backend.dto.RegisterRequest;
import SHEild.Backend.dto.UserResponse;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
   //CONSTRUCTOR
    public UserController(UserService userService) {
        this.userService = userService;
    }
     //user controller basically does CRUD operations 
     // It receives HTTP requests and delegates the work to the service.
   @PostMapping
    public ResponseEntity<UserResponse> createUser(
        @RequestBody RegisterRequest request) {

    UserResponse createdUser = userService.createUser(request);

    return ResponseEntity.ok(createdUser);
}
    @GetMapping("/{userId}")   //read by user id
    public ResponseEntity<User> getUser(@PathVariable Long userId) {

        Optional<User> user = userService.getUserById(userId);

        return user
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")   //read by user email
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {

        Optional<User> user = userService.getUserByEmail(email);

        return user
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{userId}")    //update the user id
    public ResponseEntity<User> updateUser(
            @PathVariable Long userId,
            @RequestBody User updatedUser) {

        User user = userService.updateUser(userId, updatedUser);

        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{userId}")    //delete user id
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {

        userService.deleteUser(userId);

        return ResponseEntity.noContent().build();
    }
}   //basically this controller gets requests from HTTP and runs the required methods 