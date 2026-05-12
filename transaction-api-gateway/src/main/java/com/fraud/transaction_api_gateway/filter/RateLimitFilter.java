package com.fraud.transaction_api_gateway.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitFilter implements Filter {

    // Simple in-memory rate limiter for demonstration. 
    // In production, Redis would be used here.
    private final ConcurrentHashMap<String, RequestInfo> requestCounts = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS_PER_MINUTE = 50;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // We only rate limit the high-volume transaction endpoint
        if (httpRequest.getRequestURI().startsWith("/api/v1/transactions")) {
            String clientIp = httpRequest.getRemoteAddr();
            long currentTime = System.currentTimeMillis();

            RequestInfo info = requestCounts.compute(clientIp, (ip, currentInfo) -> {
                if (currentInfo == null || (currentTime - currentInfo.timestamp) > 60000) {
                    return new RequestInfo(currentTime, new AtomicInteger(1));
                }
                currentInfo.count.incrementAndGet();
                return currentInfo;
            });

            if (info.count.get() > MAX_REQUESTS_PER_MINUTE) {
                httpResponse.setStatus(429);
                httpResponse.getWriter().write("Too Many Requests. Rate limit exceeded.");
                return;
            }
        }

        chain.doFilter(request, response);
    }

    private static class RequestInfo {
        long timestamp;
        AtomicInteger count;

        RequestInfo(long timestamp, AtomicInteger count) {
            this.timestamp = timestamp;
            this.count = count;
        }
    }
}
