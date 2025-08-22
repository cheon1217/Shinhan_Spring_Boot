package com.zerock.livestock.controller;

import com.zerock.livestock.dto.StockResponse;
import com.zerock.livestock.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @GetMapping
    public Page<StockResponse> list(Pageable pageable,
                                    @RequestParam(required = false) String q) {
        if (q != null && !q.isBlank()) {
            return stockService.search(q.trim(), pageable);
        }
        return stockService.getAll(pageable);
    }

    @GetMapping("/{id}")
    public StockResponse getOne(@PathVariable Long id) {
        return stockService.getOne(id);
    }

    @GetMapping("/{id}/history")
    public List<BigDecimal> history(@PathVariable Long id,
                                    @RequestParam(defaultValue = "30") int limit) {
        return stockService.getRecentPrices(id, limit);
    }

}