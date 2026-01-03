import { Plant, AvailabilityStatus } from '../types';
import { PLANTS as FALLBACK_PLANTS } from '../constants';

// REPLACE THIS URL with your "Publish to Web" > CSV link from Google Sheets
// Example format: https://docs.google.com/spreadsheets/d/e/2PACX-..../pub?gid=0&single=true&output=csv
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRYAyStPYuphjNY0ufHRKfOwUdNNvbCJKgvFU3jwmCSHkkZGCMOHXcRz_GyPatm065o8Y-QHmOZd1SJ/pub?output=csv'; 

export const fetchPlants = async (): Promise<Plant[]> => {
  if (!GOOGLE_SHEET_CSV_URL) {
    console.log('No Google Sheet URL configured, using local fallback data.');
    return FALLBACK_PLANTS;
  }

  try {
    // We append &t=${Date.now()} to bypass browser caching
    // This ensures we get the latest version that Google has published
    const response = await fetch(`${GOOGLE_SHEET_CSV_URL}&t=${Date.now()}`);
    
    if (!response.ok) throw new Error('Failed to fetch CSV');
    
    const text = await response.text();
    return parseCSV(text);
  } catch (error) {
    console.error('Error fetching plant data from Google Sheet:', error);
    return FALLBACK_PLANTS;
  }
};

const parseCSV = (csvText: string): Plant[] => {
  const lines = csvText.split('\n');
  if (lines.length < 2) return [];

  // Extract headers and trim them
  const headers = lines[0].split(',').map(h => h.trim());

  const plants: Plant[] = [];

  // Robust CSV splitting handling quotes
  const parseLine = (text: string) => {
    const result = [];
    let cur = '';
    let inQuote = false;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"') {
            inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
            result.push(cur.trim());
            cur = '';
        } else {
            cur += char;
        }
    }
    result.push(cur.trim());
    return result;
  };

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseLine(line);
    const row: any = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    // Map CSV string data to strongly typed Plant object
    if (row.id && row.name) {
      plants.push({
        id: row.id,
        name: row.name,
        scientificName: row.scientificName,
        description: row.description ? row.description.replace(/^"|"$/g, '') : '', 
        category: row.category as any,
        difficulty: row.difficulty as any,
        sunlight: row.sunlight as any,
        water: row.water as any,
        imageUrl: row.imageUrl,
        tags: row.tags ? row.tags.split('|').map((t: string) => t.trim()) : [],
        availability: (row.availability as AvailabilityStatus) || 'out-of-stock',
        size: row.size,
        location: row.location,
        isNew: row.isNew === 'TRUE' || row.isNew === 'true'
      });
    }
  }

  return plants;
};