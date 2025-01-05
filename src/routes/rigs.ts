import express from 'express';
import axios from 'axios';
import { load } from 'cheerio';

const router = express.Router();

interface Rigs {
  Armored: string[];
  Unarmored: string[];
}

//API for scraping the rigs section
router.get('/rigs', async (req, res) => {
  try{
    const { data } = await axios.get("https://escapefromtarkov.fandom.com/wiki/Chest_rigs"); 
    console.log("--------------------------------------");
    console.log();
    console.log("Fetched HTML for Rigs");
    console.log();
    console.log("--------------------------------------");
    

    const $ = load(data);

    const rigs: Rigs = {
      Armored: [],
      Unarmored: []
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

    //extract rigs from the respective categories
    extractRigsFromCategory('Armored', rigs.Armored);
    extractRigsFromCategory('Unarmored', rigs.Unarmored);


    //Puts rigs data into a JSON
    res.json({ rigs });
  } catch (error) {
    console.error("Error occurred during scraping:", error);
    res.status(500).send('Error scraping rig');
  }
});




export default router;