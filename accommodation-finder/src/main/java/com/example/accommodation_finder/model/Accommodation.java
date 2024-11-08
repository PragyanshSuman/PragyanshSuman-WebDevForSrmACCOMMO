package com.example.accommodation_finder.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "accommodations")
public class Accommodation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false)
    private String title;
    @Column(nullable=false)
    private String address;
    @Column(nullable=false)
    private double price;
    private double distanceFromUniversity;

    @ElementCollection
    private List<String> amenities;

    @ElementCollection
    private List<String> photos;
    @Column(nullable=false)
    private String contactEmail;
    @Column(nullable=false)
    private String contactPhone;

    @ManyToOne
    @JoinColumn(name = "broker_id",nullable=false)
    private User broker;
}