package com.urlshortener.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageConfig;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Base64;

@Service
public class QrCodeService {

    public String generateQrCodeBase64(String text, int width, int height) {
        return generateQrCodeBase64(text, width, height, "#0F172A", "#FFFFFF");
    }

    public String generateQrCodeBase64(String text, int width, int height, String foregroundHex, String backgroundHex) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

            int fgColor = parseColor(foregroundHex, 0xFF0F172A);
            int bgColor = parseColor(backgroundHex, 0xFFFFFFFF);

            MatrixToImageConfig config = new MatrixToImageConfig(fgColor, bgColor);

            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream, config);
            byte[] pngData = pngOutputStream.toByteArray();

            String base64String = Base64.getEncoder().encodeToString(pngData);
            return "data:image/png;base64," + base64String;
        } catch (Exception e) {
            throw new RuntimeException("Error generating custom QR Code: " + e.getMessage(), e);
        }
    }

    private int parseColor(String hex, int defaultColor) {
        if (hex == null || hex.trim().isEmpty()) {
            return defaultColor;
        }
        try {
            String cleanHex = hex.trim().replace("#", "");
            if (cleanHex.length() == 6) {
                return 0xFF000000 | (int) Long.parseLong(cleanHex, 16);
            } else if (cleanHex.length() == 8) {
                return (int) Long.parseLong(cleanHex, 16);
            }
        } catch (Exception ignored) {
            // fallback to defaultColor on parse failure
        }
        return defaultColor;
    }
}
