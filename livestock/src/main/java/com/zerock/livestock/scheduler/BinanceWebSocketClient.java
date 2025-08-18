package com.zerock.livestock.scheduler;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

import java.net.URI;
import java.nio.ByteBuffer;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class BinanceWebSocketClient {

    private final SimpMessagingTemplate messagingTemplate;

    @PostConstruct
    public void start() {
        try {
            // BTCUSDT 시세 스트림 (binance)
            String streamUrl = "wss://stream.binance.com:9443/ws/btcusdt@ticker";
            WebSocketClient client = new WebSocketClient(new URI(streamUrl)) {
                @Override
                public void onOpen(ServerHandshake handshake) {
                    log.info("Binance WebSocket Connected");
                }

                @Override
                public void onMessage(String message) {
                    // 여기서 message는 JSON 형태
                    messagingTemplate.convertAndSend("/topic/stocks", message);
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
