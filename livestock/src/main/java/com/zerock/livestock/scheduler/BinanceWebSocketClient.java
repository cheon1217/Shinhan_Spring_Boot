package com.zerock.livestock.scheduler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zerock.livestock.service.StockService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

import java.net.URI;
import java.nio.ByteBuffer;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class BinanceWebSocketClient {

    private final SimpMessagingTemplate messagingTemplate;
    private final StockService stockService;

    @PostConstruct
    public void start() {
        try {
            List<String> symbols = stockService.findAllSymbols();

            if (symbols.isEmpty()) {
                log.warn("연결할 심볼이 없습니다.");
                return;
            }

            // 모든 심볼 소문자로 변환 후 ticker 스트림 형식으로 결합
            String streamParam = symbols.stream()
                    .map(String::toLowerCase)
                    .map(s -> s + "@ticker")
                    .reduce((a, b) -> a + "/" + b)
                    .orElse("");

            String streamUrl = "wss://stream.binance.com:9443/stream?streams=" + streamParam;

            WebSocketClient client = new WebSocketClient(new URI(streamUrl)) {
                @Override
                public void onOpen(ServerHandshake handshake) {
                    log.info("Binance WebSocket Connected");
                }

                @Override
                public void onMessage(String message) {
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        JsonNode json = mapper.readTree(message);

                        // stream: "ethusdt@ticker", data: {...}
                        JsonNode data = json.get("data");
                        String symbol = data.get("s").asText(); // ex) "ETHUSDT"

                        Long stockId = stockService.findIdBySymbol(symbol);
                        if (stockId != null) {
                            messagingTemplate.convertAndSend("/topic/stocks/" + stockId, data.toString());
                        } else {
                            log.warn("해당 symbol에 대한 stockId를 찾을 수 없습니다: {}", symbol);
                        }
                    } catch (Exception e) {
                        log.error("WebSocket 메시지 처리 중 예외 발생", e);
                    }
                }

                @Override
                public void onMessage(ByteBuffer bytes) {
                    log.warn("Binary message received (ignored)");
                }

                @Override
                public void onClose(int code, String reason, boolean remote) {
                    log.info("Binance WebSocket Closed: {}", reason);
                }

                @Override
                public void onError(Exception ex) {
                    log.error("WebSocket Error", ex);
                }
            };
            client.connect();
        } catch (Exception e) {
            log.error("Binance WebSocket connection failed", e);
        }
    }
}
