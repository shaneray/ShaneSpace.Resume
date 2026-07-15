#!/usr/bin/env node
/**
 * Print-view QA: extract visible print text and verify ATS-critical fields/keywords.
 *
 * Usage:
 *   npm install
 *   RESUME_BASE_URL=http://localhost:8765 npm run validate-print
 */

const puppeteer = require('puppeteer');

const baseUrl = process.env.RESUME_BASE_URL || 'http://localhost:8080';
const profile = process.env.RESUME_PROFILE || '';
const profileQuery = profile ? '&profile=' + encodeURIComponent(profile) : '';
const printUrl = baseUrl + '/Index.html#/default?print=1' + profileQuery;

var requiredKeywords = [
    'Go',
    'Golang',
    'microservices',
    'distributed systems',
    'Elasticsearch',
    'Apache Pinot',
    'CI/CD',
    'on-call',
    'SRE',
    'Kafka',
    'React',
    'Applied AI',
    'prompt engineering'
];

var requiredFields = [
    { label: 'Name', pattern: /Shane Ray/ },
    { label: 'Email', pattern: /shane\.ray87@gmail\.com/ },
    { label: 'Phone', pattern: /\(502\) 541-6445/ },
    { label: 'Location', pattern: /Louisville.*Kentucky|Louisville,\s*Kentucky/i },
    { label: 'LinkedIn', pattern: /linkedin\.com\/in\/shaneray/i },
    { label: 'Github', pattern: /github\.com\/shaneray/i },
    { label: 'Summary', pattern: /Senior Software Engineer with 5\+ years at Uber owning Go microservices/i },
    { label: 'Current role', pattern: /Senior Software Engineer/ },
    { label: 'Uber company', pattern: /Uber Technologies/i },
    { label: 'Experience section', pattern: /Experience/i }
];

async function validatePrint() {
    var browser = await puppeteer.launch({ headless: 'new' });
    var page = await browser.newPage();

    await page.goto(printUrl, { waitUntil: 'networkidle0', timeout: 30000 });

    await page.waitForFunction(
        function () {
            return document.querySelector('.print-job-title') !== null;
        },
        { timeout: 15000 }
    );

    var text = await page.evaluate(function () {
        var root = document.getElementById('defaultView') || document.body;
        return root.innerText || '';
    });

    var pageHeight = await page.evaluate(function () {
        return document.body.scrollHeight;
    });

    var pdfBuffer = await page.pdf({
        format: 'Letter',
        printBackground: false,
        margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' }
    });

    await browser.close();

    var PDFDocument = require('pdf-lib').PDFDocument;
    var pdfDoc = await PDFDocument.load(pdfBuffer);
    var pdfPages = pdfDoc.getPageCount();

    var letterHeightPx = 1056;
    var estimatedPages = Math.ceil(pageHeight / letterHeightPx);

    console.log('--- Print QA ---');
    console.log('PDF pages (actual):', pdfPages, pdfPages <= 2 ? 'PASS' : 'FAIL (>2 pages)');
    console.log('Estimated pages (heuristic):', estimatedPages);
    console.log('Text length:', text.length, 'chars');
    console.log('');

    var failed = 0;

    requiredFields.forEach(function (field) {
        var pass = field.pattern.test(text);
        console.log((pass ? 'PASS' : 'FAIL') + '  ' + field.label);
        if (!pass) {
            failed++;
        }
    });

    console.log('');
    console.log('Keyword spot-check:');

    requiredKeywords.forEach(function (keyword) {
        var pass = text.toLowerCase().indexOf(keyword.toLowerCase()) >= 0;
        console.log((pass ? 'PASS' : 'FAIL') + '  ' + keyword);
        if (!pass) {
            failed++;
        }
    });

    if (text.indexOf('[object Object]') >= 0) {
        console.log('FAIL  No [object Object] artifacts');
        failed++;
    } else {
        console.log('PASS  No [object Object] artifacts');
    }

    var nonAscii = text.match(/[^\x09\x0A\x0D\x20-\x7E]/g);
    if (nonAscii && nonAscii.length) {
        var uniq = [...new Set(nonAscii.map(function (c) {
            return c + ' U+' + c.charCodeAt(0).toString(16);
        }))];
        console.log('WARN  Non-ASCII chars in PDF text:', uniq.join(', '));
    } else {
        console.log('PASS  PDF text is ASCII-safe');
    }

    if (/--\s*\d+\s+of\s+\d+\s*--/i.test(text)) {
        console.log('WARN  Chrome header/footer detected (-- N of M --). Turn off headers/footers in print dialog.');
    }

    console.log('');
    if (failed === 0) {
        console.log('All checks passed.');
        process.exit(0);
    }

    console.log(failed + ' check(s) failed.');
    process.exit(1);
}

validatePrint().catch(function (err) {
    console.error('Validation failed:', err.message);
    process.exit(1);
});
