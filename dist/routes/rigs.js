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
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
const router = express_1.default.Router();
//API for scraping the rigs section
router.get('/rigs', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield axios_1.default.get("https://escapefromtarkov.fandom.com/wiki/Chest_rigs");
        console.log("--------------------------------------");
        console.log();
        console.log("Fetched HTML for Rigs");
        console.log();
        console.log("--------------------------------------");
        const $ = (0, cheerio_1.load)(data);
        const rigs = {
            Armored: [],
            Unarmored: []
        };
        // Helper function to extract rigs from a specific category
        const extractRigsFromCategory = (categoryId, targetArray) => {
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
    }
    catch (error) {
        console.error("Error occurred during scraping:", error);
        res.status(500).send('Error scraping rig');
    }
}));
exports.default = router;
