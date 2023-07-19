
# node url summarizer
This repository contains a command line utility function to summarize text scraped from a url.



## usage 
1. Install the dependencies first
```
npm install --save
```

2. Place your API_KEY for gpt api into config.json

```
//in config.json
{
    "OPENAI_API_KEY": <paste your openai api key here>
}
```

3. Call the script
### Arguments
* url - The url to scrape from, the only required argument. 

* format - customize the way the AI summarizes the text by providing a description of the format you wish to recieve. (This is optional and will default to a summary paragraph if left blank)

* temperature - adjust the temperature of the gpt model using this argument. It defaults to 0.1 if unset by arguments. 


### Example

```
    node index.js --url="<some-url-here>" --temperature="0.5" --format="A bullet point list with complete sentences" 

```
