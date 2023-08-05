const fs = require("fs");

// Function to remove comments from the input
function removeComments(input) {
  return input.replace(/\/\/.*$/gm, "");
}

// Function to tokenize the input based on the provided ABNF grammar
function tokenize(input) {
  const lines = input.split(/\r\n|\r|\n/);
  const tokens = [];
  const groups = {};
  const relationships = [];
  const tokenRegex = /(@[\w-]+(?:\([^)]*\))?| *\[.*?\]| *-> *)/g;

  let currentGroup;
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      continue; // Skip empty lines
    }

    if (trimmedLine.startsWith("@")) {
      // If it's a group or relationship, set it as the current group or add it to relationships
      if (trimmedLine.includes("->")) {
        relationships.push(trimmedLine);
      } else {
        currentGroup = trimmedLine.replace(/\(.*\)/, "").slice(1);
        groups[currentGroup] = { fields: [] };
      }
    } else if (trimmedLine === "$end" + currentGroup) {
      // If it's the end of a group, clear the currentGroup
      currentGroup = undefined;
    } else if (trimmedLine.startsWith("[")) {
      // If it's a field, add it to the current group's fields
      const fieldContent = trimmedLine.slice(1, -1).trim();
      // Skip adding commented fields to the group's fields
      if (!fieldContent.startsWith("//")) {
        groups[currentGroup].fields.push(fieldContent);
      }
    }

    tokens.push(trimmedLine);
  }

  return { tokens, groups, relationships };
}

// Function to read the ABNF grammar from the local file
function readInputFile(inputFilePath, callback) {
  fs.readFile(inputFilePath, "utf-8", (err, inputContent) => {
    if (err) {
      console.error("Error reading the input file:", err.message);
    } else {
      callback(removeComments(inputContent)); // Remove comments before tokenizing
    }
  });
}

module.exports = { readInputFile, tokenize };
