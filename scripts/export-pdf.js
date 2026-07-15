#!/usr/bin/env node
/**
 * Headless PDF export for the print resume view.
 *
 * Usage:
 *   npm install
 *   npm run export-pdf
 *
 * Optional env vars:
 *   RESUME_BASE_URL  default http://localhost:8080
 *   RESUME_PROFILE   default (omit) | staff
 */

const fs = require('fs');
const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const path = require('path');

const baseUrl = process.env.RESUME_BASE_URL || 'http://localhost:8080';
const profile = process.env.RESUME_PROFILE || '';
const profileQuery = profile ? '&profile=' + encodeURIComponent(profile) : '';
const printUrl = baseUrl + '/#/default?print=1' + profileQuery;
const outputPath = path.resolve(__dirname, '..', 'Shane-Ray-Resume.pdf');

const pdfTitle = 'Shane Ray - Senior Software Engineer Resume';
const pdfAuthor = 'Shane Ray';
const pdfSubject = 'Senior Software Engineer, Go, microservices, Applied AI, Elasticsearch, CI/CD';

async function embedMetadata(pdfPath) {
    const bytes = fs.readFileSync(pdfPath);
    const doc = await PDFDocument.load(bytes);

    doc.setTitle(pdfTitle);
    doc.setAuthor(pdfAuthor);
    doc.setSubject(pdfSubject);
    doc.setKeywords([
        'Go',
        'microservices',
        'Applied AI',
        'Elasticsearch',
        'CI/CD',
        'Kafka',
        'React',
        'on-call'
    ]);
    doc.setCreator('ShaneSpace.Resume export-pdf.js');

    fs.writeFileSync(pdfPath, await doc.save());
}

async function exportPdf() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.goto(printUrl, { waitUntil: 'networkidle0', timeout: 30000 });

    await page.waitForFunction(
        function () {
            return document.querySelector('.print-job-title') !== null;
        },
        { timeout: 15000 }
    );

    await page.pdf({
        path: outputPath,
        format: 'Letter',
        printBackground: false,
        margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
        displayHeaderFooter: false
    });

    await browser.close();
    await embedMetadata(outputPath);
    console.log('Wrote', outputPath);
}

exportPdf().catch(function (err) {
    console.error('PDF export failed:', err.message);
    process.exit(1);
});
