import express from 'express';
import axios from 'axios';
import { load } from 'cheerio';

const router = express.Router();

  //API for scraping the Armor vests section
  router.get('/armor', async (req, res) => {
    try{
      const { data } = await axios.get("https://escapefromtarkov.fandom.com/wiki/Armor_vests"); 
      console.log("--------------------------------------");
      console.log();
      console.log("Fetched HTML for armor vests");
      console.log();
      console.log("--------------------------------------");
      
      const $ = load(data);
      const armor: string[] = [];

      //Targets the specific CSS selector and the goes through each item containing the CSS
      $('table.wikitable tbody tr').each((_, row) => {
      const armorName = $(row).find('th a').text().trim();
      if(armorName){
        console.log("Found armor:", armorName);
        armor.push(armorName);
      }
    });

    //Puts armor vest data into a JSON
    res.json({ armor });
  } catch (error) {
    console.error("Error occurred during scraping:", error);
    res.status(500).send('Error scraping armor vests');
  }
});

export default router;