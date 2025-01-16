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
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data } = yield axios_1.default.get('https://escapefromtarkov.fandom.com/wiki/Weapons');
            const $ = (0, cheerio_1.load)(data);
            const guns = {
                "Assault Carbines": [],
                "Assault Rifles": [],
                "Bolt-Action": [],
                "Marksman Rifles": [],
                Shotguns: [],
                SMGs: [],
                LMGs: [],
                Launchers: [],
                Pistols: [],
                Revolvers: [],
            };
            // Helper function to extract guns from a specific category
            const extractGunsFromCategory = (categoryId, targetArray) => {
                const categorySection = $(`#${categoryId}`).parent();
                const categoryTable = categorySection.nextAll('table.wikitable').first();
                categoryTable.find('tbody tr').each((_, row) => {
                    const gunName = $(row).find('td a.mw-redirect').text().trim();
                    if (gunName)
                        targetArray.push(gunName);
                });
            };
            // Mapping of category IDs to gun categories
            const gunCategoryMapping = {
                "Assault_carbines": "Assault Carbines",
                "Assault_rifles": "Assault Rifles",
                "Bolt-action_rifles": "Bolt-Action",
                "Designated_marksman_rifles": "Marksman Rifles",
                "Grenade_launchers": "Launchers",
                "Light_machine_guns": "LMGs",
                "Shotguns": "Shotguns",
                "Submachine_guns": "SMGs",
                "Pistols": "Pistols",
                "Revolvers": "Revolvers",
            };
            // Extract guns for each category
            Object.entries(gunCategoryMapping).forEach(([categoryId, gunType]) => {
                extractGunsFromCategory(categoryId, guns[gunType]);
            });
            // Return the result as JSON
            res.status(200).json({ guns });
        }
        catch (error) {
            console.error('Error occurred during scraping:', error);
            res.status(500).send('Error scraping guns');
        }
    });
}
exports.default = handler;
