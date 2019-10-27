package ru.ariona.userrestservice.controller;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.ariona.userrestservice.domain.User;
import ru.ariona.userrestservice.repo.UserRepo;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepo userRepo;

    @GetMapping
    public List<User> getUserList() {
        return userRepo.findAll();
    }

    @GetMapping("{id}")
    public User getUserById(@PathVariable("id") User user) {
        return user;
    }

    @PostMapping
    public User saveUser(@RequestBody User user) {
        return userRepo.save(user);
    }

    @PutMapping("{id}")
    public User editUser(@PathVariable("id") User userFromDb, @RequestBody User editedUser) {
        BeanUtils.copyProperties(editedUser,userFromDb,"id");
        return userRepo.save(userFromDb);
    }

    @DeleteMapping("{id}")
    public void deleteUser(@PathVariable("id") User user) {
        userRepo.delete(user);
    }


}
