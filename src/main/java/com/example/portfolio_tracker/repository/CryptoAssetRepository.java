package com.example.portfolio_tracker.repository;

import com.example.portfolio_tracker.model.CryptoAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CryptoAssetRepository extends JpaRepository<CryptoAsset, Long> {
    // JpaRepository හරහා අපට මූලික දත්ත ගබඩා කිරීම් (Save, FindAll, Delete) සියල්ල ස්වයංක්‍රීයව ලැබේ.
}