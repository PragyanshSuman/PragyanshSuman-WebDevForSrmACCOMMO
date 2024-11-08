package com.example.accommodation_finder.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.accommodation_finder.dto.AccommodationDTO;
import com.example.accommodation_finder.model.Accommodation;
import com.example.accommodation_finder.service.AccommodationService;
import com.example.accommodation_finder.service.FileStorageService;
import com.example.accommodation_finder.service.UserService;

@RestController
@RequestMapping("/api/accommodations")
public class AccommodationController {

    private final AccommodationService accommodationService;
    private final FileStorageService fileStorageService;
    private final UserService userService;

    @Autowired
    public AccommodationController(AccommodationService accommodationService, FileStorageService fileStorageService, UserService userService) {
        this.accommodationService = accommodationService;
        this.fileStorageService = fileStorageService;
        this.userService = userService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<?> createAccommodation(
        @RequestPart("accommodation") AccommodationDTO accommodationDTO,
        @RequestPart(value = "photos", required = false) List<MultipartFile> photos) {
    try {
        // Validate input
        if (accommodationDTO == null) {
            return ResponseEntity.badRequest().body("Accommodation data is required");
        }

        // Create accommodation
        Accommodation accommodation = accommodationService.createAccommodation(accommodationDTO, photos);
        return ResponseEntity.ok(accommodation);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to create accommodation: " + e.getMessage());
    }
}

    @GetMapping("/{id}")
    public ResponseEntity<Accommodation> getAccommodation(@PathVariable Long id) {
        return accommodationService.getAccommodationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Accommodation>> getAllAccommodations() {
        return ResponseEntity.ok(accommodationService.getAllAccommodations());
    }

    @GetMapping("/broker/{brokerId}")
    public ResponseEntity<List<Accommodation>> getAccommodationsByBrokerId(@PathVariable Long brokerId) {
        return ResponseEntity.ok(accommodationService.getAccommodationsByBrokerId(brokerId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccommodation(@PathVariable Long id) {
        try {
            accommodationService.deleteAccommodation(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}