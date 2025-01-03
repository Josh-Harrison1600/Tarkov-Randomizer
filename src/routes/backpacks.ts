import express from 'express';
import axios from 'axios';
import { load } from 'cheerio';

const router = express.Router();

  //API for scraping the backpack section
  router.get('/backpacks', async (req, res) => {
    try{
      const { data } = await axios.get("https://escapefromtarkov.fandom.com/wiki/Backpacks"); 
      console.log("--------------------------------------");
      console.log();
      console.log("Fetched HTML for Backpacks");
      console.log();
      console.log("--------------------------------------");
      
      const $ = load(data);
      const backpacks: string[] = [];

      //Targets the specific CSS selector and the goes through each item containing the CSS
      $('table.wikitable tbody tr').each((_, row) => {
      const backpackName = $(row).find('th a').text().trim();
      if(backpackName){
        console.log("Found backpack:", backpackName);
        backpacks.push(backpackName);
      }
    });

    //Puts backpack data into a JSON
    res.json({ backpacks });
  } catch (error) {
    console.error("Error occurred during scraping:", error);
    res.status(500).send('Error scraping backpacks');
  }
});

export default router;