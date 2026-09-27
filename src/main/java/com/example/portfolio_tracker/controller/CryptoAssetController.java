package com.example.portfolio_tracker.controller;

import com.example.portfolio_tracker.model.CryptoAsset;
import com.example.portfolio_tracker.repository.CryptoAssetRepository;
import com.example.portfolio_tracker.service.BinanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "*")
public class CryptoAssetController {

    @Autowired
    private CryptoAssetRepository repository;

    @Autowired
    private BinanceService binanceService;

    @GetMapping
    public List<CryptoAsset> getAllAssets() {
        List<CryptoAsset> assets = repository.findAll();
        // සෑම කාසියකටම අදාළ සජීවී මිල Binance හරහා ලබාගෙන ඇතුළත් කිරීම
        for (CryptoAsset asset : assets) {
            Double livePrice = binanceService.getLivePrice(asset.getSymbol());
            asset.setCurrentPrice(livePrice);
        }
        return assets;
    }

    @PostMapping
    public CryptoAsset addAsset(@RequestBody CryptoAsset asset) {
        return repository.save(asset);
    }
    @DeleteMapping("/{id}")
    public void deleteAsset(@PathVariable Long id) {
        repository.deleteById(id);
    }
}