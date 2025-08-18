package com.zerock.livestock.repository;

import com.zerock.livestock.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock, Long> {

    // 종목 심볼로 조회 (예: BTC, AAPL)
    Optional<Stock> findBySymbol(String symbol);
}
