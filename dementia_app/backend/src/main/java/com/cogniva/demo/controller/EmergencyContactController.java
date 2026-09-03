package com.cogniva.demo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/emergency-contact")
public class EmergencyContactController {

    @Value("${emergency.contact.name:}")
    private String contactName;

    @Value("${emergency.contact.phone:}")
    private String contactPhone;

    @GetMapping
    public Map<String, String> getEmergencyContact() {

        return Map.of(
                "name", contactName,
                "phone", contactPhone
        );
    }
}