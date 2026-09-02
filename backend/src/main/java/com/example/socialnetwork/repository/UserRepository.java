package com.example.socialnetwork.repository;

import com.example.socialnetwork.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    // User pour preciser la table de sqlite que ce repository va manipuler
    // String est le type de l id de User (@Id)
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
