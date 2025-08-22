package com.zerock.livestock.repository;

import com.zerock.livestock.dto.OhlcResponse;
import com.zerock.livestock.entity.PriceHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface PriceHistoryRepository extends JpaRepository<PriceHistory, Long> {

    // 최근 N개 PriceHistory (내림차순)
    @Query("""
           SELECT ph
           FROM PriceHistory ph
           WHERE ph.stock.id = :stockId
           ORDER BY ph.timestamp DESC
           """)
    List<PriceHistory> findRecent(@Param("stockId") Long stockId, Pageable pageable);

    // 최근 N개 가격만 추출 (내림차순)
    @Query("""
           SELECT ph.price
           FROM PriceHistory ph
           WHERE ph.stock.id = :stockId
           ORDER BY ph.timestamp DESC
           """)
    List<BigDecimal> findRecentPrices(@Param("stockId") Long stockId, Pageable pageable);

    @Query(
        value = """
            SELECT
                DATE_FORMAT(ph.timestamp, '%Y-%m-%d %H:%i') AS time,
                SUBSTRING_INDEX(GROUP_CONCAT(ph.price ORDER BY ph.timestamp ASC), ',', 1) AS open,
                MAX(ph.price) AS high,
                MIN(ph.price) AS low,
                SUBSTRING_INDEX(GROUP_CONCAT(ph.price ORDER BY ph.timestamp DESC), ',', 1) AS close
            FROM price_history ph
            WHERE ph.stock_id = :stockId
            GROUP BY DATE_FORMAT(ph.timestamp, '%Y-%m-%d %H:%i')
            ORDER BY time
        """,
        nativeQuery = true
    )
    List<Object[]> getOhlcData(@Param("stockId") Long stockId);

}
