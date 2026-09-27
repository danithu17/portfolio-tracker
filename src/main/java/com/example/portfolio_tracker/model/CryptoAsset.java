package com.example.portfolio_tracker.model;

import jakarta.persistence.*;

@Entity
public class CryptoAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String coinName;
    private String symbol;
    private Double quantity;
    private Double buyPrice;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCoinName() { return coinName; }
    public void setCoinName(String coinName) { this.coinName = coinName; }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public Double getBuyPrice() { return buyPrice; }
    public void setBuyPrice(Double buyPrice) { this.buyPrice = buyPrice; }

    private Double liquidationPrice;

    public Double getLiquidationPrice() {
        return liquidationPrice;
    }

    public void setLiquidationPrice(Double liquidationPrice) {
        this.liquidationPrice = liquidationPrice;
    }



    @Transient // මෙය Database එකේ Table එකට එකතු නොවන බව පෙන්වයි
    private Double currentPrice;

    public Double getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(Double currentPrice) { this.currentPrice = currentPrice; }
}