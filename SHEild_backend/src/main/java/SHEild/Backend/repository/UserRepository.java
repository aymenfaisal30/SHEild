package SHEild.Backend.repository;
//this is your Repository layer
//its job is basically to talk to the database for your User data.
import SHEild.Backend.entity.User;
//working with user id
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
//UserRepository gets all the functionality of JpaRepository
//User → What entity are we working with?
//Long → What type is the primary key?
    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);
}