"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
// API for scraping the helmets section
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data } = yield axios_1.default.get("https://escapefromtarkov.fandom.com/wiki/Headwear");
            console.log("--------------------------------------");
            console.log();
            console.log("Fetched HTML for Helmets");
            console.log();
            console.log("--------------------------------------");
            const $ = (0, cheerio_1.load)(data);
            const helmets = {
                armored: [],
                vanity: [],
            };
            // Helper function to extract helmets from a specific category
            const extractHelmetsFromCategory = (categoryId, targetArray) => {
                const categorySection = $(`#${categoryId}`).parent();
                const categoryTable = categorySection.nextAll('table.wikitable').first();
                categoryTable.find('tbody tr').each((_, row) => {
                    const helmetName = $(row).find('th a').text().trim();
                    if (helmetName) {
                        console.log(`Found headwear in ${categoryId}:`, helmetName);
                        targetArray.push(helmetName);
                    }
                });
            };
            // Extract helmets from the respective categories
            extractHelmetsFromCategory('Armored', helmets.armored);
            extractHelmetsFromCategory('Vanity', helmets.vanity);
            // Puts helmet data into a JSON
            res.status(200).json({ helmets });
        }
        catch (error) {
            console.error("Error occurred during scraping helmets:", error);
            res.status(500).send('Error scraping helmets');
        }
    });
}
exports.default = handler;
