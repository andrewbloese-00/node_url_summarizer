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

module.exports = {chunkText}