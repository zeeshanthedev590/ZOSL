// Import the readInputFile function from file1.js
const { readInputFile, tokenize } = require("./parser.js");

// Usage example:
const inputFile = "example.zosl"; // Replace with the actual path to your input file

readInputFile(inputFile, (inputContent) => {
  // Tokenize the input based on the ABNF grammar
  const result = tokenize(inputContent);
  console.log("Tokens:", result.tokens);
  console.log("Groups:", result.groups);
  console.log("Relationships:", result.relationships);
});
