
import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/saopaulo_neighborhoods.json');

try {
  const data = fs.readFileSync(filePath, 'utf-8');
  let neighborhoods = JSON.parse(data);

  const initialCount = neighborhoods.length;
  
  // Remove specific bad entries
  neighborhoods = neighborhoods.filter(n => n !== "City Cussud" && n !== "City América");

  // Deduplicate
  neighborhoods = [...new Set(neighborhoods)];

  // Sort
  neighborhoods.sort((a, b) => a.localeCompare(b, 'pt-BR'));

  console.log(`Cleaned neighborhoods. Removed ${initialCount - neighborhoods.length} items (including duplicates).`);

  fs.writeFileSync(filePath, JSON.stringify(neighborhoods, null, 2), 'utf-8');
  console.log('File updated successfully.');

} catch (error) {
  console.error('Error processing file:', error);
}
