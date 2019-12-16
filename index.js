const fs = require("fs");
const path = require("path");
const gs = require("ghostscript4js");
const puppeteer = require("puppeteer");
const urlParser = require("url");
const semver = require("semver");
const minimumSemVer = "12.13.0";

if (!semver.gte(process.version, minimumSemVer)) {
  throw Error(
    `Requires Node version ${minimumSemVer}. See install docs about NVM`
  );
}

const prefix = "https://old.reddit.com/";
const headless = true;
let urls = [];

exports.mirror = async function mirror({ username }) {
  const urlsPath = path.join(__dirname, `urls-${username}.json`);
  let url = `${prefix}user/${username}`;
  const browser = await puppeteer.launch({ headless });
  const context = browser.defaultBrowserContext();
  await context.overridePermissions(prefix, []);

  const page = await browser.newPage();
  page.emulateMedia("screen");
  await page.setViewport({
    width: 1920,
    height: 1080
  });

  while (true) {
    console.log("Going to ", url);
    await page.goto(url, { waitUntil: "networkidle0" });
    await redditExpando(page);
    const next = await page.$('[rel="nofollow next"]');
    if (next) {
      if (headless === true) {
        const filename = sanitise(url.substring(prefix.length));
        urls.push({ url, filename, scrapedAtDateUTC: new Date().getTime() });
        await fs.promises.writeFile(urlsPath, JSON.stringify(urls, null, 2), {
          encoding: "utf-8"
        });
        await page.pdf({
          path: `${__dirname}/${filename}.pdf`,
          format: "A4",
          printBackground: true
        });
      }
      const newUrlAttribute = await next.getProperty("href");
      const newUrl = await newUrlAttribute.jsonValue();
      url = urlParser.resolve(url, newUrl);
    } else {
      break;
    }
  }
  await browser.close();
  await mergePDF({ username });
};

const redditExpando = async page => {
  const handles = await page.$$(".expando-button");
  if (handles) {
    const buttonArray = Array.from(handles);
    for (let button of buttonArray) {
      try {
        await button.click();
        await sleep(2500);
      } catch (e) {
        // pass
      }
    }
  }
  await autoScroll(page);
  await sleep(5000);
};

const autoScroll = async page => {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      let distance = 100;
      let timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
};

const sanitise = str => str.replace(/[^a-zA-Z0-9_-]/gi, "-");

const sleep = timeMs =>
  new Promise(resolve => {
    setTimeout(resolve, timeMs);
  });

function mergePDF({ username }) {
  const urlsPath = path.join(__dirname, `urls-${username}.json`);
  const urlsData = fs.readFileSync(urlsPath, { encoding: "utf-8" }).toString();
  urls = JSON.parse(urlsData);
  const filenames = urls.map(url => `${url.filename}.pdf`);
  const outName = `${username}-MERGED.pdf`;
  gs.executeSync(
    ` -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -dPDFSETTINGS=/prepress -sOutputFile=${outName} ${filenames.join(
      " "
    )}`
  );
  console.log(`Complete! Archive written to ${outName}`);
}

exports.mergePDF = mergePDF;
