import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import { load } from 'cheerio';

// This defines the structure of the guns object
interface Guns {
  "Assault Carbines": string[];
  "Assault Rifles": string[];
  "Bolt-Action": string[];
  "Marksman Rifles": string[];
  Shotguns: string[];
  SMGs: string[];
  LMGs: string[];
  Launchers: string[];
  Pistols: string[];
  Revolvers: string[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { data } = await axios.get('https://escapefromtarkov.fandom.com/wiki/Weapons');
    const $ = load(data);

    const guns: Guns = {
      "Assault Carbines": [],
      "Assault Rifles": [],
      "Bolt-Action": [],
      "Marksman Rifles": [],
      Shotguns: [],
      SMGs: [],
      LMGs: [],
      Launchers: [],
      Pistols: [],
      Revolvers: [],
    };

    // Helper function to extract guns from a specific category
    const extractGunsFromCategory = (categoryId: string, targetArray: string[]): void => {
      const categorySection = $(`#${categoryId}`).parent();
      const categoryTable = categorySection.nextAll('table.wikitable').first();

      categoryTable.find('tbody tr').each((_, row) => {
        const gunName = $(row).find('td a.mw-redirect').text().trim();
        if (gunName) targetArray.push(gunName);
      });
    };

    // Mapping of category IDs to gun categories
    const gunCategoryMapping: Record<string, keyof Guns> = {
      "Assault_carbines": "Assault Carbines",
      "Assault_rifles": "Assault Rifles",
      "Bolt-action_rifles": "Bolt-Action",
      "Designated_marksman_rifles": "Marksman Rifles",
      "Grenade_launchers": "Launchers",
      "Light_machine_guns": "LMGs",
      "Shotguns": "Shotguns",
      "Submachine_guns": "SMGs",
      "Pistols": "Pistols",
      "Revolvers": "Revolvers",
    };

    // Extract guns for each category
    Object.entries(gunCategoryMapping).forEach(([categoryId, gunType]) => {
      extractGunsFromCategory(categoryId, guns[gunType]);
    });

    // Return the result as JSON
    res.status(200).json({ guns });
  } catch (error) {
    console.error('Error occurred during scraping:', error);
    res.status(500).send('Error scraping guns');
  }
}
