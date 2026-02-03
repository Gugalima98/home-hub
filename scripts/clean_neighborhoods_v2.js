
import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/saopaulo_neighborhoods.json');

try {
  const data = fs.readFileSync(filePath, 'utf-8');
  let neighborhoods = JSON.parse(data);

  const initialCount = neighborhoods.length;
  
  // Specific removal list based on user feedback and inspection
  const toRemove = [
    "City Cussud",
    "City América",
    "Bora-Bora", // Looks like a condominium or nickname
    "Panda", // Suspicious
    "Vila Baby", // Suspicious
    "Vila Chuca", // Suspicious
    "Jardim Estester", // Typo
    "Jardim Guuedala", // Typo
    "Jardim Estester",
  ];

  // Specific corrections map
  const corrections = {
    "Jardim Estester": "Jardim Ester",
    "Jardim Guuedala": "Jardim Guedala",
    "Vila Sta. Terezinha": "Vila Santa Terezinha"
  };

  // Apply corrections first
  neighborhoods = neighborhoods.map(n => corrections[n] || n);

  // Filter out bad names
  neighborhoods = neighborhoods.filter(n => !toRemove.includes(n));

  // Deduplicate
  neighborhoods = [...new Set(neighborhoods)];

  // Sort
  neighborhoods.sort((a, b) => a.localeCompare(b, 'pt-BR'));

  console.log(`Cleaned neighborhoods. Removed ${initialCount - neighborhoods.length} items (including duplicates).`);
  console.log(`Current total: ${neighborhoods.length}`);

  fs.writeFileSync(filePath, JSON.stringify(neighborhoods, null, 2), 'utf-8');
  console.log('File updated successfully.');

} catch (error) {
  console.error('Error processing file:', error);
}
