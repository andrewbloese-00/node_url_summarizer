const {Configuration,OpenAIApi} = require("openai")
const { chunkText, chunkIntoOptimalEvenGroups } = require("./chunkText")
const apiKey = require("../config.json").OPENAI_API_KEY

const config = new Configuration({apiKey})
const openai = new OpenAIApi(config)
const SYS_MSG = "You are an assistant who specializes in creating useful summaries of raw text content from the web. You are only to consider the relevant information on a webpage, disregarding navbars, buttons and other html elements. Also ignore state information such as 'cart is empty' "
const OPENAI_MODEL = "gpt-3.5-turbo"
const MAX_DEPTH = 4
/**
 * 
 * @param {string} input the input to be summarized 
 * @param {number} temperature *optional* the temparature to pass to the gpt model
 * @returns  {Promise<{error?: any, summary?:string}>}
 */
async function summaryCompletion(input,temperature=0.1,format="tl;dr like summary writen like a paragraph (or more)"){
    try {
        const messages = [ 
            { role: "system", content: SYS_MSG },
            { role: "user", content: `Write a summary of the 'Text', it should formatted like: ${format}. Text = ${input}`}
        ]
        const response = await openai.createChatCompletion({
            model: OPENAI_MODEL,
            temperature,
            messages,
        })
        
        const summary = response.data.choices[0].message.content;
        
        if(!summary) return { error: "Failed to generate a summary..."}
        return { summary }
    } catch (error) {
        return { error }
    }
}

/**
 * @param {string} text - the input text to be summarized
 * @about a recursive function that will generate new summaries for each section of the text until it is within the token limits of gpt-3.5.turbo
 * @returns { Promise<{error:any} | Promise<{summary:string}> }
 */
async function summarize(text = "",temperature=0.1,format="tl;dr like summary in the form of a paragraph",d=0){
   const chunked = chunkIntoOptimalEvenGroups(text)
   if(chunked.length === 1 || d > MAX_DEPTH) { 
        const {summary ,error }= await summaryCompletion(chunked[0],temperature,format)
        if(error) return { error}
        return {summary}
   }
    console.log('OpenAI is typing...')
    const summaryQ = chunked.map( chunk => summaryCompletion(chunk,temperature,format))
    const summariesOfChunks = await Promise.all(summaryQ)
    
    //join the text of summaries
    const summaryText = summariesOfChunks
        .filter(summary=>!summary.error)
        .map(s=>s.summary)
        .join("\n")
    
    return summarize(summaryText,temperature,format,d+1)
}








module.exports = {summarize,summaryCompletion}