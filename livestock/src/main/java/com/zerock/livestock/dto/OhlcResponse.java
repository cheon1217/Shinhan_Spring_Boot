package com.zerock.livestock.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OhlcResponse {
    private LocalDateTime time;  // 해당 시간대 (예: 1분 단위)
    private BigDecimal open;
    private BigDecimal high;
    private BigDecimal low;
    private BigDecimal close;
}
