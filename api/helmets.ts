import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import { load } from 'cheerio';

// This defines the structure of the helmets object
interface Helmets {
  armored: string[];
  vanity: string[];
}

// API for scraping the helmets section
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { data } = await axios.get("https://escapefromtarkov.fandom.com/wiki/Headwear");
    console.log("--------------------------------------");
    console.log();
    console.log("Fetched HTML for Helmets");
    console.log();
    console.log("--------------------------------------");

    const $ = load(data);

    const helmets: Helmets = {
      armored: [],
      vanity: [],
    };

    // Helper function to extract helmets from a specific category
    const extractHelmetsFromCategory = (categoryId: string, targetArray: string[]): void => {
      const categorySection = $(`#${categoryId}`).parent();
      const categoryTable = categorySection.nextAll('table.wikitable').first();

      categoryTable.find('tbody tr').each((_, row) => {
        const helmetName = $(row).find('th a').text().trim();
        if (helmetName) {
          console.log(`Found headwear in ${categoryId}:`, helmetName);
          targetArray.push(helmetName);
        }
      });
    };

    // Extract helmets from the respective categories
    extractHelmetsFromCategory('Armored', helmets.armored);
    extractHelmetsFromCategory('Vanity', helmets.vanity);

    // Puts helmet data into a JSON
    res.status(200).json({ helmets });
  } catch (error) {
    console.error("Error occurred during scraping helmets:", error);
    res.status(500).send('Error scraping helmets');
  }
}
