package com.luiz.lojaferramentas.controller;

import com.luiz.lojaferramentas.dto.BannerDTO;
import com.luiz.lojaferramentas.dto.BannerRequestDTO;
import com.luiz.lojaferramentas.service.BannerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    @GetMapping
    public ResponseEntity<List<BannerDTO>> listAll() {
        return ResponseEntity.ok(bannerService.listAll());
    }

    @GetMapping("/active")
    public ResponseEntity<List<BannerDTO>> listActive() {
        return ResponseEntity.ok(bannerService.listActive());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BannerDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(bannerService.getById(id));
    }

    @PostMapping
    public ResponseEntity<BannerDTO> create(@Valid @RequestBody BannerRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bannerService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BannerDTO> update(@PathVariable Integer id,
                                            @Valid @RequestBody BannerRequestDTO request) {
        return ResponseEntity.ok(bannerService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        bannerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
