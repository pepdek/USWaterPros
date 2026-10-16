// Full-page screenshots of the conversion pages at phone and desktop widths. Needs the dev server on :3200 and Chrome installed.
import { chromium } from '@playwright/test';

const pages = [['home', '/'], ['whole-home', '/services/whole-home-water-filtration'], ['tacoma', '/services/whole-home-water-filtration-tacoma'], ['thanks', '/thanks']];
const sizes = [[390, 844], [1280, 800]];
const browser = await chromium.launch({ channel: 'chrome' });
for (const [w, h] of sizes) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  for (const [name, path] of pages) {
    await page.goto('http://localhost:3200' + path, { waitUntil: 'networkidle' });
    const over = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    await page.screenshot({ path: `review-screenshots/${name}-${w}.png`, fullPage: true });
    console.log(name, w, over ? 'HORIZONTAL SCROLL' : 'ok');
  }
  await page.close();
}
await browser.close();
