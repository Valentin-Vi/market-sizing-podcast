import { readFileSync } from 'fs';

function extractTitlesAndCreators(filePath: string): void {
  // Read and parse the file
  const content = readFileSync(filePath, 'utf-8');
  const entries: { title: string; creator: string }[] = JSON.parse(content);

  // Extract and print titles
  console.log('=== Titles ===');
  entries.forEach(entry => console.log(entry.title));

  console.log('\n=== Creators ===');
  entries.forEach(entry => console.log(entry.creator));
}

extractTitlesAndCreators('data/top_podcasts_argentina.txt');