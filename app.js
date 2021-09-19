const express = require("express");
const app = express();
const puppeteer = require("puppeteer");

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}));

var imgs = [];
async function start(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    imgs = await page.evaluate(() => {
        return Array.from(document.images).map((i) => i.src);
    });
    await browser.close();
}

app.get("/", (req, res) => {
    imgs = [];
    res.render("index", {imgs});
});

app.post("/", async (req, res) => {
    await start(req.body.url);
    res.render("index", {imgs});
});

app.listen(process.env.PORT || 5000);