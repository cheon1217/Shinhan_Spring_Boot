package com.zerock.livestock.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Builder
@AllArgsConstructor @NoArgsConstructor
public class StockResponse {
    private Long id;
    private String symbol;
    private String name;
    private BigDecimal price;
    private BigDecimal changeRate;
    private Long volume;
    private LocalDateTime lastUpdated;
    private List<BigDecimal> recentPrices;
}
