package com.zerock.livestock.service;

import com.zerock.livestock.config.SecurityUtils;
import com.zerock.livestock.entity.Stock;
import com.zerock.livestock.entity.User;
import com.zerock.livestock.entity.Watchlist;
import com.zerock.livestock.repository.StockRepository;
import com.zerock.livestock.repository.UserRepository;
import com.zerock.livestock.repository.WatchlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WatchlistServiceImpl implements WatchlistService {

    private final UserRepository userRepository;
    private final StockRepository stockRepository;
    private final WatchlistRepository watchlistRepository;

    @Override
    public void addStockToWatchlist(String stockSymbol) {
        String username = SecurityUtils.getCurrentUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Stock stock = stockRepository.findBySymbol(stockSymbol)
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        if (watchlistRepository.existsByUserAndStock(user, stock)) {
            throw new IllegalStateException("Already in watchlist");
        }

        Watchlist watchlist = Watchlist.builder()
                .user(user)
                .stock(stock)
                .build();

        watchlistRepository.save(watchlist);
    }

    @Override
    public void removeStockFromWatchlist(String stockSymbol) {
        String username = SecurityUtils.getCurrentUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Stock stock = stockRepository.findBySymbol(stockSymbol)
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        Watchlist watchlist = watchlistRepository.findByUserAndStock(user, stock)
                .orElseThrow(() -> new RuntimeException("Not in watchlist"));

        watchlistRepository.delete(watchlist);
    }

    @Override
    public List<Stock> getUserWatchlist() {
        String username = SecurityUtils.getCurrentUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return watchlistRepository.findAllByUser(user)
                .stream()
                .map(Watchlist::getStock)
                .toList();
    }
}
