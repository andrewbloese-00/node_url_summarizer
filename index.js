const { scrapePageText }=require("./utils/scraper")
const { summarize } = require("./utils/gptHelpers")
const { getArgs} = require("./utils/argParse")
const fs = require("fs")
async function main(){
    const args = getArgs(process)
    let temperature = Number(args.temperature) || 0.1;
    let format = args.format || "A tl;dr style summary in paragraph format. "
    if(!args.url && !args.iFile){
        console.error("Error: url or iFile must be provided to run this script.")
        process.exit(1)
    }
    let text; 

    //allow to pass an input file if desired
    if(args.iFile){
        text = fs.readFileSync(args.iFile,{encoding: "utf-8"})
    } else { 
        console.time(`scrape ${args.url}`)
        const scrape = await scrapePageText(args.url) 
        if(scrape.error){
            console.error("Error: Failed to scrape page text");
            console.timeEnd(`scrape ${args.url}`)
            process.exit(1)
        }
        text = scrape.text
        console.timeEnd(`scrape ${args.url}`)

    }
    
    console.time("Generate Summary")
    const { summary , error } = await summarize(text,temperature,format)
    
    if(error){
        console.error("Error: Failed to summarize text from url...")
        console.error(error)
        console.timeEnd("Generate Summary")
        process.exit(1)
    }
    
    console.timeEnd("Generate Summary")
    if(args.oFile){
        fs.writeFileSync(args.oFile, summary, {encoding: "utf8"})
        console.log('Wrote Summary to ' + args.oFile)
    } else { 
        console.log(summary)
    }
    process.exit(0)




}
main()