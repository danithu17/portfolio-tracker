package com.example.portfolio_tracker.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class BinanceService {
    public Double getLivePrice(String symbol) {
        try {
            // Binance API හරහා සජීවී මිල ලබාගැනීමේ සබැඳිය
            String url = "https://api.binance.com/api/v3/ticker/price?symbol=" + symbol.toUpperCase() + "USDT";
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response != null && response.containsKey("price")) {
                return Double.parseDouble(response.get("price").toString());
            }
        } catch (Exception e) {
            System.out.println("Error fetching price for " + symbol + ": " + e.getMessage());
        }
        return 0.0;
    }
}