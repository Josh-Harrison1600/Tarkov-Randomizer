import express from 'express';
import axios from 'axios';
import { load } from 'cheerio';

const router = express.Router();

//This defines the structure of the guns object
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

//API for scraping the weapons section
router.get('/guns', async (req, res) => {
    try {
      const { data } = await axios.get('https://escapefromtarkov.fandom.com/wiki/Weapons');
      console.log("--------------------------------------");
      console.log();
      console.log("Fetched HTML for Guns");
      console.log();
      console.log("--------------------------------------");
  
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
          if (gunName) {
            console.log(`Found gun in ${categoryId}:`, gunName);
            targetArray.push(gunName);
          }
        });
      };
      
    //Mapping of category IDs to gun categories
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

    //For loop to iterate over each gun category
    Object.entries(gunCategoryMapping).forEach(([categoryId, gunType]) => {
      extractGunsFromCategory(categoryId, guns[gunType]);
    })
  
      //Puts gun data into a JSON
      res.json({ guns });
    } catch (error) {
      console.error("Error occurred during scraping:", error);
      res.status(500).send('Error scraping guns');
    }
  });

export default router;