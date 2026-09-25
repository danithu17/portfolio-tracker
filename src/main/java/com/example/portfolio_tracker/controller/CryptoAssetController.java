package com.example.portfolio_tracker.controller;

import com.example.portfolio_tracker.model.CryptoAsset;
import com.example.portfolio_tracker.repository.CryptoAssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "*") // Frontend එකෙන් එන requests වලට ඉඩ ලබා දීමට
public class CryptoAssetController {

    @Autowired
    private CryptoAssetRepository repository;

    // සියලුම Crypto කාසි ලබාගැනීම (GET Request)
    @GetMapping
    public List<CryptoAsset> getAllAssets() {
        return repository.findAll();
    }

    // අලුත් Crypto කාසියක් දත්ත සමුදායට එකතු කිරීම (POST Request)
    @PostMapping
    public CryptoAsset addAsset(@RequestBody CryptoAsset asset) {
        return repository.save(asset);
    }
}