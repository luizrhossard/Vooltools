package com.luiz.lojaferramentas.controller;

import com.luiz.lojaferramentas.domain.Banner;
import com.luiz.lojaferramentas.service.BannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    @GetMapping
    public List<Banner> listAll() {
        return bannerService.listAll();
    }

    @GetMapping("/active")
    public List<Banner> listActive() {
        return bannerService.listActive();
    }

    @GetMapping("/{id}")
    public Banner getById(@PathVariable Integer id) {
        return bannerService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Banner create(@RequestBody Banner banner) {
        return bannerService.create(banner);
    }

    @PutMapping("/{id}")
    public Banner update(@PathVariable Integer id, @RequestBody Banner banner) {
        return bannerService.update(id, banner);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        bannerService.delete(id);
    }
}
