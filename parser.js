const fs = require("fs");

// Function to tokenize the input based on the provided ABNF grammar
function tokenize(input) {
  const tokens = [];
  const groups = {};
  const relationships = [];
  const tokenRegex =
    /(@[\w-]+(?:\([^)]*\))? *\[([^\]]*)\]|\[([^\]]*)\]|\[[^\]]*\]|@[\w-]+(?:\([^)]*\))? *-> *@[\w-]+(?:\([^)]*\))?|@[\w-]+|\S+)/g;

  let currentGroup;
  let match;
  while ((match = tokenRegex.exec(input)) !== null) {
    const token = match[0].trim();
    tokens.push(token);

    if (token.startsWith("@")) {
      // If it's a group or relationship, set it as the current group or add it to relationships
      if (token.includes("->")) {
        relationships.push(token);
      } else {
        currentGroup = token.replace(/\(.*\)/, "").slice(1);
        groups[currentGroup] = { fields: [] };
      }
    } else if (token === "end" + currentGroup) {
      // If it's the end of a group, clear the currentGroup
      currentGroup = undefined;
    } else if (token.startsWith("[") && currentGroup) {
      // If it's a field, add it to the current group's fields
      const fieldContent = token.slice(1, -1).trim();
      groups[currentGroup].fields.push(fieldContent);
    }
  }

  return { tokens, groups, relationships };
}

// Function to read the ABNF grammar from the local file
function readInputFile(inputFilePath, callback) {
  fs.readFile(inputFilePath, "utf-8", (err, inputContent) => {
    if (err) {
      console.error("Error reading the input file:", err.message);
    } else {
      callback(inputContent);
    }
  });
}

// Usage example:
const inputFile = "example.zosl"; // Replace with the actual path to your input file
// const abnfFilePath = "zosl.abnf"; // Replace with the actual path to your ABNF file

// Read the input content from the file
readInputFile(inputFile, (inputContent) => {
  // Tokenize the input based on the ABNF grammar
  const result = tokenize(inputContent);
  console.log("Tokens:", result.tokens);
  console.log("Groups:", result.groups);
  console.log("Relationships:", result.relationships);
});
