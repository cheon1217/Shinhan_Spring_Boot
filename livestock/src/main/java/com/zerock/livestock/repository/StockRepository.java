package com.zerock.livestock.repository;

import com.zerock.livestock.entity.Stock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock, Long> {

    @Query("SELECT s FROM Stock s WHERE LOWER(s.symbol) = LOWER(:symbol)")
    Optional<Stock> findBySymbolIgnoreCase(@Param("symbol") String symbol);

    // 심볼 또는 이름으로 부분 검색(공개 메인에서 검색창용)
    @Query("""
           SELECT s FROM Stock s
           WHERE LOWER(s.symbol) LIKE LOWER(CONCAT('%', :q, '%'))
              OR LOWER(s.name)   LIKE LOWER(CONCAT('%', :q, '%'))
           """)
    Page<Stock> search(@Param("q") String query, Pageable pageable);
}
