import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import { load } from 'cheerio';

// This defines the structure of the rigs object
interface Rigs {
  Armored: string[];
  Unarmored: string[];
}

// API for scraping the rigs section
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { data } = await axios.get("https://escapefromtarkov.fandom.com/wiki/Chest_rigs");
    console.log("--------------------------------------");
    console.log();
    console.log("Fetched HTML for Rigs");
    console.log();
    console.log("--------------------------------------");

    const $ = load(data);

    const rigs: Rigs = {
      Armored: [],
      Unarmored: [],
    };

    // Helper function to extract rigs from a specific category
    const extractRigsFromCategory = (categoryId: string, targetArray: string[]): void => {
      const categorySection = $(`#${categoryId}`).parent();
      const categoryTable = categorySection.nextAll('table.wikitable').first();

      categoryTable.find('tbody tr').each((_, row) => {
        const rigName = $(row).find('th a').text().trim();
        if (rigName) {
          console.log(`Found rig in ${categoryId}:`, rigName);
          targetArray.push(rigName);
        }
      });
    };

    // Extract rigs from the respective categories
    extractRigsFromCategory('Armored', rigs.Armored);
    extractRigsFromCategory('Unarmored', rigs.Unarmored);

    // Puts rigs data into a JSON
    res.status(200).json({ rigs });
  } catch (error) {
    console.error("Error occurred during scraping rigs:", error);
    res.status(500).send('Error scraping rigs');
  }
}
