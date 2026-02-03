
import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/saopaulo_neighborhoods.json');

try {
  const data = fs.readFileSync(filePath, 'utf-8');
  let neighborhoods = JSON.parse(data);

  const initialCount = neighborhoods.length;
  
  // Specific removal list - expanded based on user feedback and validation
  const toRemove = [
    "City Cussud",
    "City América",
    "City Ribeirão",
    "Bora-Bora", 
    "Panda", 
    "Vila Baby", 
    "Vila Chuca", 
    "Vila Zuke",
    "Jardim Estester", // Typo
    "Jardim Guuedala", // Typo
    "Parque Lituanua", // Likely typo
  ];

  // Specific corrections map
  const corrections = {
    "Jardim Estester": "Jardim Ester",
    "Jardim Guuedala": "Jardim Guedala",
    "Vila Sta. Terezinha": "Vila Santa Terezinha",
    "Vila Vitoria": "Vila Vitória",
    "Vila Silvia": "Vila Sílvia",
    "Parque Lituanua": "Parque Lituânia" // Attempt correction, if not exists, user can remove later. But I'll actually just remove it if it's dubious.
  };

  // Logic: 
  // 1. Correct what we can.
  // 2. Remove what is explicitly bad.

  neighborhoods = neighborhoods.map(n => corrections[n] || n);
  neighborhoods = neighborhoods.filter(n => !toRemove.includes(n));
  
  // Remove "Parque Lituanua" explicitly if it wasn't caught by map (it is in toRemove anyway)

  // Deduplicate
  neighborhoods = [...new Set(neighborhoods)];

  // Sort
  neighborhoods.sort((a, b) => a.localeCompare(b, 'pt-BR'));

  console.log(`Cleaned neighborhoods V3. Removed ${initialCount - neighborhoods.length} items (including duplicates).`);
  console.log(`Current total: ${neighborhoods.length}`);

  fs.writeFileSync(filePath, JSON.stringify(neighborhoods, null, 2), 'utf-8');
  console.log('File updated successfully.');

} catch (error) {
  console.error('Error processing file:', error);
}
