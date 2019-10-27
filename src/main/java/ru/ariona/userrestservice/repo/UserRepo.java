package ru.ariona.userrestservice.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ariona.userrestservice.domain.User;

public interface UserRepo extends JpaRepository<User,Long> {

}
