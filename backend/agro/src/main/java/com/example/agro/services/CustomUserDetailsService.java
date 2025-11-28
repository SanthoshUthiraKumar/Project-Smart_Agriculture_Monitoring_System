package com.example.agro.services;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.agro.Models.User;
import com.example.agro.Repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = repository.findByUsername(username)
         .orElse(repository.findByEmail(username)
         .orElseThrow(() -> new UsernameNotFoundException("User not found")));

        
        // We pass an empty list for authorities since we aren't using Roles
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), new ArrayList<>());
    }
}