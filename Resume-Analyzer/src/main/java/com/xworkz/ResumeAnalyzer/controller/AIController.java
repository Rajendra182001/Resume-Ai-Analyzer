package com.xworkz.ResumeAnalyzer.controller;

import com.xworkz.ResumeAnalyzer.service.GeminiService;
import com.xworkz.ResumeAnalyzer.service.GeminiiService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
public class AIController {

    private final GeminiiService geminiService;

    public AIController(GeminiiService geminiService) {
        this.geminiService = geminiService;
    }

    @GetMapping("/ask")
    public String ask(@RequestParam String q) {
        return geminiService.ask(q);
    }
}