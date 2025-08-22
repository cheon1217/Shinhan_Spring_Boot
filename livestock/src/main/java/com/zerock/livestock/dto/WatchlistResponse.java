package com.zerock.livestock.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class WatchlistResponse {
    private Long stockId;
    private String symbol;
    private String name;
}