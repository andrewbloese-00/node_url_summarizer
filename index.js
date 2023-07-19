const { scrapePageText }=require("./utils/scraper")
const { summarize } = require("./utils/gptHelpers")
const { getArgs} = require("./utils/argParse")






async function main(){
    const args = getArgs(process)
    if(!args.url){
        console.error("Error: url must be provided to run this script.")
        process.exit(1)
    }

    console.time(`scrape ${args.url}`)
    const scrape = await scrapePageText(args.url) 
    if(scrape.error){
        console.error("Error: Failed to scrape page text");
        console.timeEnd(`scrape ${args.url}`)
        process.exit(1)
    }
    console.timeEnd(`scrape ${args.url}`)
    let temperature = Number(args.temperature) || 0.1,
    format = args.format || "A tl;dr style summary in paragraph format. "
    
    console.time("Generate Summary")
    const { summary , error } = await summarize(scrape.text, temperature,format)
    
    if(error){
        console.error("Error: Failed to summarize text from url...")
        console.error(error)
        console.timeEnd("Generate Summary")
        process.exit(1)
    }
    
    console.timeEnd("Generate Summary")
    console.log(summary)
    process.exit(0)




}
main()