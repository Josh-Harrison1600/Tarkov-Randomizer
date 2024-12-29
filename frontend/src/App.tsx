import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import Footer from './Footer';

const App: React.FC = () => {
    const [guns, setGuns] = useState<string[]>([]);
    const [helmets, setHelmets] = useState<string[]>([]);
    const [randomGun, setRandomGun] = useState<string | null>(null);
    const [randomHelmet, setRandomHelmet] = useState<string | null>(null);
    const [armor, setArmor] = useState<string[]>([]);
    const [randomArmor, setRandomArmor] = useState<string | null>(null);
    const videoUrl = import.meta.env.VITE_API_S3;

    // Call the API to get the items
    const fetchItems = async (itemType: string) => {
        try {
            const response = await fetch(`http://localhost:3001/api/${itemType}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data[itemType];
        } catch (error) {
            console.error(`Error fetching ${itemType} data:`, error);
            return[];
        }
    };

    //fetch data
    useEffect(() => {
      const fetchAllItems = async () => {
        const gunsData = await fetchItems('guns');
        const helmetsData = await fetchItems('helmets');
        const armorData = await fetchItems('armor');
        setGuns(gunsData);
        setHelmets(helmetsData);
        setArmor(armorData);
      };
      fetchAllItems();
    }, []);


    // Function for selecting random weapon
    const handleRandomize = () => {
      if(guns.length > 0){
        const randomGunIndex = Math.floor(Math.random() * guns.length);
        setRandomGun(guns[randomGunIndex]);
      }
      if(helmets.length > 0){
        const randomHelmetIndex = Math.floor(Math.random() * helmets.length);
        setRandomHelmet(helmets[randomHelmetIndex]);
      }
      if(armor.length > 0){
        const randomArmorIndex = Math.floor(Math.random() * armor.length);
        setRandomArmor(armor[randomArmorIndex]);
      }
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Background Video */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover -z-10 filter blur-lg scale-105"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Content */}
            <div className="flex-grow flex flex-col items-center justify-center text-red-500">
                {/* Generate Loadout Button */}
                <button
                    onClick={handleRandomize}
                    className="relative items-center justify-center inline-block p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 rounded-lg shadow-2xl group"
                >
                    <span className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-red-500 rounded-full blur-md ease"></span>
                    <span className="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-180 ease">
                        <span className="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-purple-500 rounded-full blur-md"></span>
                        <span className="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-pink-500 rounded-full blur-md"></span>
                    </span>
                    <span className="relative text-white font-bold">Generate Loadout</span>
                </button>
                {randomGun && <p className="text-2xl mt-4 text-white">Gun: {randomGun}</p>}
                {randomHelmet && <p className="text-2xl mt-4 text-white">Helmet: {randomHelmet}</p>}
                {randomArmor && <p className="text-2xl mt-4 text-white">Armor: {randomArmor}</p>}
            </div>
            <Footer />
        </div>
    );
};

export default App;
