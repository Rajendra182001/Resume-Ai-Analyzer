package com.xworkz.ResumeAnalyzer.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class GeminiiService {

    private final ChatClient chatClient;

    public GeminiiService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public String ask(String message) {

        String response = chatClient.prompt()
                .user(message)
                .call()
                .content();

        System.out.println("Gemini response: " + response);

        return response;
    }

}
