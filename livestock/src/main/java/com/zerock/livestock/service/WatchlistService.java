package com.zerock.livestock.service;

import com.zerock.livestock.dto.WatchlistResponse;
import java.util.List;

public interface WatchlistService {
    void addStockToWatchlist(String stockSymbol);
    void removeStockFromWatchlist(String stockSymbol);
    List<WatchlistResponse> getUserWatchlist();
}
