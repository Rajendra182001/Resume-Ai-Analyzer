package com.xworkz.ResumeAnalyzer.util;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;

import java.io.ByteArrayOutputStream;

public class PdfGenerator {

    public static byte[] createPdf(String text) throws Exception {

        PDDocument document = new PDDocument();
        PDPage page = new PDPage();

        document.addPage(page);

        PDPageContentStream content =
                new PDPageContentStream(document, page);

        content.beginText();
        content.setLeading(14.5f);
        content.newLineAtOffset(50, 700);

        for (String line : text.split("\n")) {
            content.showText(line);
            content.newLine();
        }

        content.endText();
        content.close();

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        document.save(out);
        document.close();

        return out.toByteArray();
    }
}