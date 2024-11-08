package com.example.accommodation_finder.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.accommodation_finder.model.Accommodation;

public interface AccommodationRepository extends JpaRepository<Accommodation, Long> {
    List<Accommodation> findByBrokerId(Long brokerId);
}