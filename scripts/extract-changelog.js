import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetVersion = process.argv[2]; // e.g. "0.7.0"

if (!targetVersion) {
  console.error('Please provide a version number as an argument.');
  process.exit(1);
}

const updatesFilePath = path.join(__dirname, '../src/data/updates.ts');

try {
  const fileContent = fs.readFileSync(updatesFilePath, 'utf-8');

  // Simple regex to extract content for valid typescript file
  // Searches for: version: '0.7.0', ... content: `...`
  // Note: This relies on the specific formatting of updates.ts
  const versionRegex = new RegExp(`version:\\s*'${targetVersion}',[\\s\\S]*?content:\\s*\`([\\s\\S]*?)\``);
  const match = fileContent.match(versionRegex);

  if (match && match[1]) {
    // Trim and output the content
    console.log(match[1].trim());
  } else {
    console.error(`Version ${targetVersion} not found in updates.ts`);
    process.exit(1);
  }
} catch (error) {
  console.error('Error reading or parsing updates.ts:', error);
  process.exit(1);
}
