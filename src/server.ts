import express from 'express';
import axios from 'axios';
import { load } from 'cheerio'; 
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());

//API for scraping the weapons section
app.get('/api/guns', async (req, res) => {
  try {
    const { data } = await axios.get('https://escapefromtarkov.fandom.com/wiki/Weapons');
    console.log("Fetched HTML for guns");

    const $ = load(data);
    const guns: string[] = [];

    //Targets the specific CSS selector and the goes through each item containing the CSS
    $('table.wikitable tbody tr').each((_, row) => {
      const gunName = $(row).find('td a.mw-redirect').text().trim();
      if (gunName) {
        console.log("Found gun:", gunName);
        guns.push(gunName);
      }
    });

    //Puts gun data into a JSON
    res.json({ guns });
  } catch (error) {
    console.error("Error occurred during scraping:", error);
    res.status(500).send('Error scraping guns');
  }
});




  //API for scraping the helmets section
  app.get('/api/helmets', async (req, res) => {
    try{
      const { data } = await axios.get("https://escapefromtarkov.fandom.com/wiki/Headwear"); 
      console.log("Fetched HTML for helmets");

      const $ = load(data);
      const helmets: string[] = [];

      //Targets the specific CSS selector and the goes through each item containing the CSS
      $('table.wikitable tbody tr').each((_, row) => {
      const helmetName = $(row).find('th a').text().trim();
      if(helmetName){
        console.log("Found helmet:", helmetName);
        helmets.push(helmetName);
      }
    });

    //Puts helmet data into a JSON
    res.json({ helmets });
  } catch (error) {
    console.error("Error occurred during scraping:", error);
    res.status(500).send('Error scraping helmets');
  }
});




  //API for scraping the Armor vests section
  app.get('/api/armor', async (req, res) => {
    try{
      const { data } = await axios.get("https://escapefromtarkov.fandom.com/wiki/Armor_vests"); 
      console.log("Fetched HTML for armor vests");

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



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
