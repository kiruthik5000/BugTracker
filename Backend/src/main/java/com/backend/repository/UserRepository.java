package com.backend.repository;

import com.backend.entity.Role;
import com.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findAllByRole(Role role);

    User findByUsername(String username);

//    Optional<User> findByUsername(String username);
}
