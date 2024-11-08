package com.example.accommodation_finder.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.accommodation_finder.dto.AccommodationDTO;
import com.example.accommodation_finder.model.Accommodation;
import com.example.accommodation_finder.model.User;
import com.example.accommodation_finder.repository.AccommodationRepository;

@Service
public class AccommodationService {

    private final AccommodationRepository accommodationRepository;
    private final UserService userService;
    private final FileStorageService fileStorageService;

    @Autowired
    public AccommodationService(AccommodationRepository accommodationRepository, UserService userService, FileStorageService fileStorageService) {
        this.accommodationRepository = accommodationRepository;
        this.userService = userService;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
public Accommodation createAccommodation(AccommodationDTO accommodationDTO, List<MultipartFile> photos) {
    try {
        // Validate broker
        User broker = userService.findByUsername(accommodationDTO.getBrokerUsername());
        if (broker == null || !broker.getRole().equals("BROKER")) {
            throw new IllegalArgumentException("Invalid broker or insufficient permissions");
        }

        // Validate required fields
        if (accommodationDTO.getTitle() == null || accommodationDTO.getTitle().trim().isEmpty() ||
            accommodationDTO.getAddress() == null || accommodationDTO.getAddress().trim().isEmpty() ||
            accommodationDTO.getPrice() <= 0) {
            throw new IllegalArgumentException("Missing required fields");
        }

        // Create new accommodation
        Accommodation accommodation = new Accommodation();
        accommodation.setTitle(accommodationDTO.getTitle());
        accommodation.setAddress(accommodationDTO.getAddress());
        accommodation.setPrice(accommodationDTO.getPrice());
        accommodation.setDistanceFromUniversity(accommodationDTO.getDistanceFromUniversity());
        accommodation.setAmenities(accommodationDTO.getAmenities());
        accommodation.setContactEmail(accommodationDTO.getContactEmail());
        accommodation.setContactPhone(accommodationDTO.getContactPhone());
        accommodation.setBroker(broker);

        // Handle photo uploads
        if (photos != null && !photos.isEmpty()) {
            List<String> photoUrls = fileStorageService.storeFiles(photos);
            accommodation.setPhotos(photoUrls);
        }

        // Save to database
        return accommodationRepository.save(accommodation);
    } catch (Exception e) {
        throw new RuntimeException("Failed to create accommodation: " + e.getMessage(), e);
    }
}

    public Optional<Accommodation> getAccommodationById(Long id) {
        return accommodationRepository.findById(id);
    }

    public List<Accommodation> getAllAccommodations() {
        return accommodationRepository.findAll();
    }

    public List<Accommodation> getAccommodationsByBrokerId(Long brokerId) {
        return accommodationRepository.findByBrokerId(brokerId);
    }

    @Transactional
    public void deleteAccommodation(Long id) {
        Accommodation accommodation = accommodationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Accommodation not found"));
        
        fileStorageService.deleteFiles(accommodation.getPhotos());
        accommodationRepository.delete(accommodation);
    }
}