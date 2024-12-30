import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import Footer from './Footer';
import ItemPicked from './assets/ItemPicked.wav';
import objectives from './Objectives';

const App: React.FC = () => {
    const [guns, setGuns] = useState<string[]>([]);
    const [helmets, setHelmets] = useState<string[]>([]);
    const [randomGun, setRandomGun] = useState<string | null>(null);
    const [randomHelmet, setRandomHelmet] = useState<string | null>(null);
    const [armor, setArmor] = useState<string[]>([]);
    const [randomArmor, setRandomArmor] = useState<string | null>(null);
    const [spinningGun, setSpinningGun] = useState<string | null>(null);
    const [spinningHelmet, setSpinningHelmet] = useState<string | null>(null);
    const [spinningArmor, setSpinningArmor] = useState<string | null>(null);
    const [spinningMap, setSpinningMap] = useState<string | null>(null);
    const [randomMap, setRandomMap] = useState<string | null>(null);
    const [showLoadout, setShowLoadout] = useState(false); 
    const [randomObjective, setRandomObjective] = useState<string | null>(null); 
    const [spinningObjective, setSpinningObjective] = useState<string | null>(null);
    const [maps] = useState<string[]>(["Customs", "Factory", "Shoreline", "Interchange", "Reserve", "Woods", "The Lab", "Lighthouse", "Streets of Tarkov", "Ground Zero"]);
    const videoUrl = import.meta.env.VITE_API_S3;

    //function to play sound
    const playSound = () => {
        const audio = new Audio(ItemPicked);
        audio.play();
    }

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

    //function for selecting random weapon
    const handleRandomize = () => {
      setShowLoadout(true);
      if(guns.length > 0){
        let gunIndex = 0;
        const gunInterval = setInterval(() => {
            setSpinningGun(guns[gunIndex]);
            gunIndex = (gunIndex + 1) % guns.length;
        }, 100);

        setTimeout(() => {
            clearInterval(gunInterval);
            const randomGunIndex = Math.floor(Math.random() * guns.length);
            setRandomGun(guns[randomGunIndex]);
            setSpinningGun(null);
            playSound();
        }, 2000);
    }
        //randomize helmets
        if (helmets.length > 0) {
            let helmetIndex = 0;
            const helmetInterval = setInterval(() => {
                setSpinningHelmet(helmets[helmetIndex]);
                helmetIndex = (helmetIndex + 1) % helmets.length;
            }, 100);

            setTimeout(() => {
                clearInterval(helmetInterval);
                const randomHelmetIndex = Math.floor(Math.random() * helmets.length);
                setRandomHelmet(helmets[randomHelmetIndex]);
                setSpinningHelmet(null);
                playSound();
            }, 3000); 
        }
        //randomize armor
        if (armor.length > 0) {
            let armorIndex = 0;
            const armorInterval = setInterval(() => {
                setSpinningArmor(armor[armorIndex]);
                armorIndex = (armorIndex + 1) % armor.length;
            }, 100);

            setTimeout(() => {
                clearInterval(armorInterval);
                const randomArmorIndex = Math.floor(Math.random() * armor.length);
                setRandomArmor(armor[randomArmorIndex]);
                setSpinningArmor(null);
                playSound();
            }, 4000);
        }
           //randomize maps
            if (maps.length > 0) {
                let mapIndex = 0;
                const mapInterval = setInterval(() => {
                    setSpinningMap(maps[mapIndex]);
                    mapIndex = (mapIndex + 1) % maps.length;
                }, 100);

                setTimeout(() => {
                    clearInterval(mapInterval);
                    const randomMapIndex = Math.floor(Math.random() * maps.length);
                    const selectedMap = maps[randomMapIndex];
                    setRandomMap(selectedMap);
                    setSpinningMap(null);
                    playSound();

                    setTimeout(() => {
                        const mapObjectives = objectives[selectedMap] || [];
                        if (mapObjectives.length > 0) {
                            let objectiveIndex = 0;
                            const objectiveInterval = setInterval(() => {
                                setSpinningObjective(mapObjectives[objectiveIndex]);
                                objectiveIndex = (objectiveIndex + 1) % mapObjectives.length;
                            }, 100);

                            setTimeout(() => {
                                clearInterval(objectiveInterval);
                                const randomObjectiveIndex = Math.floor(Math.random() * mapObjectives.length);
                                setRandomObjective(mapObjectives[randomObjectiveIndex]);
                                setSpinningObjective(null);
                                playSound();
                            }, 1000);
                        }
                    }); 
                }, 5000);
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

                {/* Display Random Gun, Helmet, and Armor */}
                {showLoadout && (
                    <div className="mt-6 text-white text-center">
                    <div className="mb-4">
                        <p className="text-2xl font-bold">Gun:</p>
                        <p className="text-xl mt-2">{spinningGun || randomGun}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-2xl font-bold">Helmet:</p>
                        <p className="text-xl mt-2">{spinningHelmet || randomHelmet}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-2xl font-bold">Armor:</p>
                        <p className="text-xl mt-2">{spinningArmor || randomArmor}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-2xl font-bold">Map:</p>
                        <p className="text-xl mt-2">{spinningMap || randomMap}</p>
                    </div>
                    <div className="mb-4">
                            <p className="text-2xl font-bold">Objective:</p>
                            <p className="text-xl mt-2">{spinningObjective || randomObjective}</p>
                        </div>
                </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default App;
