package com.zerock.livestock.service;

import com.zerock.livestock.dto.StockResponse;
import com.zerock.livestock.entity.Stock;
import com.zerock.livestock.repository.PriceHistoryRepository;
import com.zerock.livestock.repository.StockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StockServiceImpl implements StockService {

    private final StockRepository stockRepository;
    private final PriceHistoryRepository priceHistoryRepository;

    @Override
    public Long findIdBySymbol(String symbol) {
        return stockRepository.findBySymbolIgnoreCase(symbol)
                .map(Stock::getId)
                .orElse(null);
    }

    @Override
    public List<String> findAllSymbols() {
        return stockRepository.findAll().stream()
                .map(Stock::getSymbol)
                .toList();
    }

    @Override
    public Page<StockResponse> getAll(Pageable pageable) {
        return stockRepository.findAll(pageable).map(this::toDto);
    }

    @Override
    public Page<StockResponse> search(String query, Pageable pageable) {
        return stockRepository.search(query, pageable).map(this::toDto);
    }

    @Override
    public StockResponse getOne(Long id) {
        Stock s = stockRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Stock not found: " + id));
        return toDto(s);
    }

    @Override
    public List<BigDecimal> getRecentPrices(Long stockId, int limit) {
        int capped = Math.min(Math.max(limit, 1), 200);
        Pageable p = PageRequest.of(0, capped);
        List<BigDecimal> desc = priceHistoryRepository.findRecentPrices(stockId, p); // 최신→과거
        Collections.reverse(desc); // 과거→최신 순서로 반환 (차트용)
        return desc;
    }

    private StockResponse toDto(Stock s) {
        List<BigDecimal> recentPrices = getRecentPrices(s.getId(), 30);
        return StockResponse.builder()
                .id(s.getId())
                .symbol(s.getSymbol())
                .name(s.getName())
                .price(s.getPrice())
                .changeRate(s.getChangeRate())
                .volume(s.getVolume())
                .lastUpdated(s.getLastUpdated())
                .recentPrices(recentPrices)
                .build();
    }
}
