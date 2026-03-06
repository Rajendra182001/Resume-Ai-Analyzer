package com.xworkz.ResumeAnalyzer.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final ChatClient chatClient;

    public GeminiService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public String analyzeResume(String resumeText) {

        String prompt = """
         You are an ATS resume analyzer.
         Analyze the resume and return:
         1. ATS Score out of 100
         2. Technical Skills Found
         3. Missing Skills
         4. 5 Interview Questions
         5. Suggestions to improve resume

         Resume:
         """ + resumeText;
        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }

    public String matchSkills(String resumeText, String jobDescription) {

        String prompt = """
       You are an ATS system.

       Compare the RESUME with the JOB DESCRIPTION.

       Return:

       1. Match Score (%)
       2. Matching Skills
       3. Missing Skills
       4. Suggestions to improve match

       Resume:
       """ + resumeText + """

       Job Description:
        """ + jobDescription;

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }

    public String improveResume(String resumeText) {
        String prompt = """
      Rewrite the following resume professionally.

       Improve:
       1. Bullet points
       2. ATS keywords
       3. Technical impact
       4. Clarity
       Return a better formatted resume.

       Resume:
       """ + resumeText;
        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }

    public String generateResume(String profile) {

        String prompt = """
       Create a professional software developer resume.

       Profile:
       """ + profile + """
      Include:
      1. Summary
      2. Skills
      3. Experience
      4. Projects
      5. Education
      """;

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }
}