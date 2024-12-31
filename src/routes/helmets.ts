  import express from 'express';
  import axios from 'axios';
  import { load } from 'cheerio';
  
  const router = express.Router();
  
  //API for scraping the helmets section
  router.get('/helmets', async (req, res) => {
    try{
      const { data } = await axios.get("https://escapefromtarkov.fandom.com/wiki/Headwear"); 
      console.log("--------------------------------------");
      console.log();
      console.log("Fetched HTML for helmets");
      console.log();
      console.log("--------------------------------------");
      

      const $ = load(data);
      const helmets: string[] = [];

    // Helper function to extract guns from a specific category
    const extractHelmetsFromCategory = (categoryId: string): void => {
        const categorySection = $(`#${categoryId}`).parent();
        const categoryTable = categorySection.nextAll('table.wikitable').first();
  
        categoryTable.find('tbody tr').each((_, row) => {
          const helmetName = $(row).find('th a').text().trim();
          if (helmetName) {
            console.log(`Found headwear in ${categoryId}:`, helmetName);
            helmets.push(helmetName);
          }
        });
      };
  
      //extract guns from the respective categories
      extractHelmetsFromCategory('Mount');
      extractHelmetsFromCategory('Armored');
      extractHelmetsFromCategory('Vanity');
  
      //Puts gun data into a JSON
      res.json({ helmets });
    } catch (error) {
      console.error("Error occurred during scraping:", error);
      res.status(500).send('Error scraping headwear');
    }
  });




export default router;