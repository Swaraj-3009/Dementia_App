package com.cogniva.demo.dto;

public class CaregiverResponse {

    private Long id;
    private String name;
    private String username;
    private String email;
    private String phone;

    public CaregiverResponse() {
    }

    public CaregiverResponse(
            Long id,
            String name,
            String username,
            String email,
            String phone) {

        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.phone = phone;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }
}
