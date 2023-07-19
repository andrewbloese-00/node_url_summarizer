//note that each token is roughly 4 characters 
const TOKEN_LIMIT = 4000;

function chunkText(text) {

    // Check if text is within the token limit
    if ( (text.length/4) <= TOKEN_LIMIT) {
      console.log('single chunk')
      return [text];
    }
  
    const sentences = text.split('.'); 
    const chunks = [];
  
    let currentChunk = '';
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      const tempChunk = currentChunk + sentence + '.';
      
      if ((tempChunk.length/4) > TOKEN_LIMIT) {
        chunks.push(currentChunk);
        currentChunk = ''; 
      }
  
      currentChunk += sentence + '.';
    }
    //ensure all chunks are done
    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }
    return chunks;
}


const countTokens = text => Math.ceil(text.length/4)

function chunkTextV2(text,tokensPerChunk=300){
  //calculate number of tokens in input
  const textTokensEstimate = countTokens(text)

  if(textTokensEstimate < tokensPerChunk){
    return [text]
  }



  //get sentences from input
  const sentences = text.split(".")
  let chunks = []
  let currentChunk = ""
  for(let s = 0; s < sentences.length; s++){
    let sentenceTokens = countTokens(sentences[s])
    if(countTokens(currentChunk) + sentenceTokens > tokensPerChunk){
      chunks.push(currentChunk)
      currentChunk = ""
    }
    currentChunk += sentences[s] + ". "
  }

  if(currentChunk.length > 0){
    chunks.push(currentChunk)
  }
  return chunks

}


function chunkIntoOptimalEvenGroups(inputString) {
  const length = inputString.length;
  const minChunkSize = 1000; // Minimum number of tokens per chunk
  const maxChunkSize = 4000; // Maximum number of tokens per chunk


  if(countTokens(inputString) < TOKEN_LIMIT){
    return [inputString]
  }


  let chunkSize = Math.ceil(length / 2);
  let numChunks = 2;

  //determine optimal even chunk size
  for (let i = 2; i <= Math.ceil(length / minChunkSize); i++) {
    if (length % i === 0) {
      const currentChunkSize = length / i;
      if (
        currentChunkSize >= minChunkSize &&
        currentChunkSize <= maxChunkSize 
      ) {
        if (
         ( currentChunkSize < chunkSize ||
          (currentChunkSize === chunkSize && i < numChunks)) 
        ) {
          chunkSize = currentChunkSize;
          numChunks = i;
        }
      }
    }
  }

  //use chunking helper function to get chunks of optimal size
  const chunks = chunkTextV2(inputString,chunkSize)
  
  return chunks;
  
}

module.exports = {chunkIntoOptimalEvenGroups}