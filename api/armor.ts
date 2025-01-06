import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import { load } from 'cheerio';

// API for scraping the Armor vests section
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { data } = await axios.get("https://escapefromtarkov.fandom.com/wiki/Armor_vests");
    console.log("--------------------------------------");
    console.log();
    console.log("Fetched HTML for Armor Vests");
    console.log();
    console.log("--------------------------------------");

    const $ = load(data);
    const armor: string[] = [];

    // Targets the specific CSS selector and goes through each item containing the CSS
    $('table.wikitable tbody tr').each((_, row) => {
      const armorName = $(row).find('th a').text().trim();
      if (armorName) {
        console.log("Found armor:", armorName);
        armor.push(armorName);
      }
    });

    // Puts armor vest data into a JSON
    res.status(200).json({ armor });
  } catch (error) {
    console.error("Error occurred during scraping armor vests:", error);
    res.status(500).send('Error scraping armor vests');
  }
}
