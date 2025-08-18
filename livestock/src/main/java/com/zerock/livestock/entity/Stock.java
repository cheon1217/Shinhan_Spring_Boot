package com.zerock.livestock.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "stocks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stock {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 10)
    private String symbol; // 예: BTC, AAPL

    @Column(nullable = false, length = 50)
    private String name;

    private BigDecimal price;
    private Long volume;
    private BigDecimal changeRate;
    private LocalDateTime lastUpdated;

    @OneToMany(mappedBy = "stock", cascade = CascadeType.ALL)
    private List<PriceHistory> priceHistories;
}

