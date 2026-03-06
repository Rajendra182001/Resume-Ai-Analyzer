package com.xworkz.ResumeAnalyzer.controller;

import com.xworkz.ResumeAnalyzer.service.GeminiService;
import com.xworkz.ResumeAnalyzer.service.ResumeService;
import com.xworkz.ResumeAnalyzer.util.PdfGenerator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/resume")
@CrossOrigin(origins = "*")
public class ResumeController {

    private final ResumeService resumeService;
    private final GeminiService geminiService;


    public ResumeController(ResumeService resumeService,GeminiService geminiService) {
        this.resumeService = resumeService;
        this.geminiService=geminiService;
    }

    @PostMapping("/analyze")
    public String analyzeResume(@RequestParam MultipartFile file) {
        return resumeService.analyze(file);
    }

    @PostMapping("/match")
    public String matchResume(
            @RequestParam MultipartFile file,
            @RequestParam String jobDescription) {
        return resumeService.match(file, jobDescription);
    }

    @PostMapping("/improve")
    public String improveResume(@RequestParam MultipartFile file) {
        return resumeService.improve(file);
    }

    @PostMapping("/generate")
    public String generateResume(@RequestBody String profile) {
        return geminiService.generateResume(profile);

    }

    @PostMapping("/download")
    public ResponseEntity<byte[]> download(@RequestParam MultipartFile file) throws Exception {
        String improved = resumeService.improve(file);
        byte[] pdf = PdfGenerator.createPdf(improved);
        return ResponseEntity.ok()
                .header("Content-Disposition","attachment; filename=improved_resume.pdf")
                .body(pdf);
    }
}