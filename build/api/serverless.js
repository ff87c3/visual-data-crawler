const chromium = require('@sparticuz/chromium-min');
const puppeteer = require('puppeteer-core');

async function getBrowser() {
    return puppeteer.launch({
        args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(
            `https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`
        ),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
    });
}

module.exports = async (req, res) => {
    const { url } = req.body;
    try {
        const browser = await getBrowser();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const text = await page.evaluate(() => document.body.innerText);

        await browser.close();
        res.json({ text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
