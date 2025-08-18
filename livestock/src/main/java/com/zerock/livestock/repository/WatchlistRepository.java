package com.zerock.livestock.repository;

import com.zerock.livestock.entity.Stock;
import com.zerock.livestock.entity.Watchlist;
import com.zerock.livestock.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {
    boolean existsByUserAndStock(User user, Stock stock);
    Optional<Watchlist> findByUserAndStock(User user, Stock stock);
    List<Watchlist> findAllByUser(User user);
}
