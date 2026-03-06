package com.xworkz.ResumeAnalyzer.service;

import com.xworkz.ResumeAnalyzer.util.PdfUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ResumeService {

    private final GeminiService geminiService;

    public ResumeService(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public String analyze(MultipartFile file) {
        try {
            String text = PdfUtils.extractText(file.getInputStream());
            return geminiService.analyzeResume(text);
        } catch (Exception e) {
            throw new RuntimeException("Resume processing failed");
        }
    }

    public String match(MultipartFile file, String jobDescription) {
        try {
            String resumeText = PdfUtils.extractText(file.getInputStream());
            return geminiService.matchSkills(resumeText, jobDescription);
        } catch (Exception e) {
            throw new RuntimeException("Matching failed");
        }
    }

    public String improve(MultipartFile file) {
        try {
            String resumeText = PdfUtils.extractText(file.getInputStream());
            return geminiService.improveResume(resumeText);
        } catch (Exception e) {
            throw new RuntimeException("Improvement failed");
        }
    }
}