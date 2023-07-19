const puppeteer = require("puppeteer")
/**
 * 
 * @param {string} url a url to a webpage to scrape the text contents of. 
 * @returns {Promise<{error:boolean,text?:string}>}
 */
async function scrapePageText(url){
    let browser, page
    try {
        if(!browser){
            browser = await puppeteer.launch({"headless":"new"})
            page = await browser.newPage()
            page.setDefaultNavigationTimeout(2*60*1000);
        }
        await page.goto(url)
        
        await page.$('body')

        const text = await page.evaluate(()=>{
            return [...document.querySelectorAll("p,h1,h2")].map(p=>p.textContent).join("\n")
        })
        
        return { text , error: false} 


    } catch (e) {
        console.error(e)
        return { text: null, error: e}
    }
}

module.exports = {scrapePageText}