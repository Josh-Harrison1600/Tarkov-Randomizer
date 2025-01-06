import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import { load } from 'cheerio';

// API for scraping the backpack section
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { data } = await axios.get("https://escapefromtarkov.fandom.com/wiki/Backpacks");
    console.log("--------------------------------------");
    console.log();
    console.log("Fetched HTML for Backpacks");
    console.log();
    console.log("--------------------------------------");

    const $ = load(data);
    const backpacks: string[] = [];

    // Targets the specific CSS selector and goes through each item containing the CSS
    $('table.wikitable tbody tr').each((_, row) => {
      const backpackName = $(row).find('th a').text().trim();
      if (backpackName) {
        console.log("Found backpack:", backpackName);
        backpacks.push(backpackName);
      }
    });

    // Puts backpack data into a JSON
    res.status(200).json({ backpacks });
  } catch (error) {
    console.error("Error occurred during scraping backpacks:", error);
    res.status(500).send('Error scraping backpacks');
  }
}
