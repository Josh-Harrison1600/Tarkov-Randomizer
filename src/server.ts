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
    console.log("Fetched HTML from wiki");

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

    //Puts it into a JSON
    res.json({ guns });
  } catch (error) {
    console.error("Error occurred during scraping:", error);
    res.status(500).send('Error scraping data');
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
