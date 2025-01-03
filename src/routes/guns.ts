import express from 'express';
import axios from 'axios';
import { load } from 'cheerio';

const router = express.Router();


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
      const guns: string[] = [];
  
      // Helper function to extract guns from a specific category
      const extractGunsFromCategory = (categoryId: string): void => {
        const categorySection = $(`#${categoryId}`).parent();
        const categoryTable = categorySection.nextAll('table.wikitable').first();
  
        categoryTable.find('tbody tr').each((_, row) => {
          const gunName = $(row).find('td a.mw-redirect').text().trim();
          if (gunName) {
            console.log(`Found gun in ${categoryId}:`, gunName);
            guns.push(gunName);
          }
        });
      };
  
      //extract guns from the respective categories
      extractGunsFromCategory('Assault_carbines');
      extractGunsFromCategory('Assault_rifles');
      extractGunsFromCategory('Bolt-action_rifles');
      extractGunsFromCategory('Designated_marksman_rifles');
      extractGunsFromCategory('Grenade_launchers');
      extractGunsFromCategory('Light_machine_guns');
      extractGunsFromCategory('Shotguns');
      extractGunsFromCategory('Submachine_guns');
      extractGunsFromCategory('Pistols');
      extractGunsFromCategory('Revolvers');
      extractGunsFromCategory('Shotguns_2');
  
  
      //Puts gun data into a JSON
      res.json({ guns });
    } catch (error) {
      console.error("Error occurred during scraping:", error);
      res.status(500).send('Error scraping guns');
    }
  });

export default router;