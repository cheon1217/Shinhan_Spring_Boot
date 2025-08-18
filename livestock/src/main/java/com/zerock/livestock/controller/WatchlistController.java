package com.zerock.livestock.controller;

import com.zerock.livestock.entity.Stock;
import com.zerock.livestock.entity.Watchlist;
import com.zerock.livestock.service.WatchlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/watchlist")
@RequiredArgsConstructor
public class WatchlistController {

    private final WatchlistService watchlistService;

    @PostMapping("/add/{symbol}")
    public ResponseEntity<String> addToWatchlist(@PathVariable String symbol) {
        watchlistService.addStockToWatchlist(symbol);
        return ResponseEntity.ok("관심 종목 추가 완료");
    }

    @DeleteMapping("/remove/{symbol}")
    public ResponseEntity<String> removeFromWatchlist(@PathVariable String symbol) {
        watchlistService.removeStockFromWatchlist(symbol);
        return ResponseEntity.ok("관심 종목 삭제 완료");
    }

    @GetMapping
    public ResponseEntity<List<Stock>> getUserWatchlist() {
        return ResponseEntity.ok(watchlistService.getUserWatchlist());
    }
}