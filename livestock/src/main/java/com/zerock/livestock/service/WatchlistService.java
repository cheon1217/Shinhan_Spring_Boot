package com.zerock.livestock.service;

import com.zerock.livestock.entity.Stock;
import java.util.List;

public interface WatchlistService {
    void addStockToWatchlist(String stockSymbol);
    void removeStockFromWatchlist(String stockSymbol);
    List<Stock> getUserWatchlist();
}
