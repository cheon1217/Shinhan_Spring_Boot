package com.zerock.livestock.service;

import com.zerock.livestock.dto.StockResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface StockService {
    Long findIdBySymbol(String symbol);
    List<String> findAllSymbols();

    // 공개 메인용
    Page<StockResponse> getAll(Pageable pageable);
    Page<StockResponse> search(String query, Pageable pageable);
    StockResponse getOne(Long id);

    List<BigDecimal> getRecentPrices(Long stockId, int limit);

}
