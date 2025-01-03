import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import Footer from './Footer';
import ItemPicked from './assets/ItemPicked.wav';
import objectives from './Objectives';

const App: React.FC = () => {
  // This defines the state for all item categories
  const [items, setItems] = useState<Record<string, string[]>>({
    guns: [],
    helmets: [],
    armor: [],
    rigs: [],
    backpacks: [],
    maps: ["Customs", "Factory", "Shoreline", "Interchange", "Reserve", "Woods", "The Lab", "Lighthouse", "Streets of Tarkov", "Ground Zero"],
    objectives:[],
  });

  const [randomized, setRandomized] = useState<Record<string, string | null>>({
    guns: null,
    helmets: null,
    armor: null,
    rigs: null,
    backpacks: null,
    maps: null,
    objectives: null,
  });

  const [spinning, setSpinning] = useState<Record<string, string | null>>({
    guns: null,
    helmets: null,
    armor: null,
    rigs: null,
    backpacks: null,
    maps: null,
    objectives: null,
  });

  const [showLoadout, setShowLoadout] = useState(false);

  const videoUrl = import.meta.env.VITE_API_S3;

  // Audio for when item is selected
  const playSound = () => {
    const audio = new Audio(ItemPicked);
    audio.play();
  };

  // Fetches backend information
  const fetchItems = async (itemType: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/${itemType}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      return data[itemType];
    } catch (error) {
      console.error(`Error fetching ${itemType} data:`, error);
      return [];
    }
  };

  // Fetch all items from the backend
  useEffect(() => {
    const fetchAllItems = async () => {
      const guns = await fetchItems('guns');
      const helmets = await fetchItems('helmets');
      const armor = await fetchItems('armor');
      const rigs = await fetchItems('rigs');
      const backpacks = await fetchItems('backpacks');
      setItems((prev) => ({
        ...prev,
        guns,
        helmets,
        armor,
        rigs,
        backpacks,
      }));
    };
    fetchAllItems();
  }, []);

  // Randomize an item with spinning animation
  const randomizeItem = (type: string, delay: number) => {
    if (items[type].length === 0) return;

    let index = 0;
    const interval = setInterval(() => {
      setSpinning((prev) => ({ ...prev, [type]: items[type][index] }));
      index = (index + 1) % items[type].length;
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const randomIndex = Math.floor(Math.random() * items[type].length);
      setRandomized((prev) => ({ ...prev, [type]: items[type][randomIndex] }));
      setSpinning((prev) => ({ ...prev, [type]: null }));
      playSound();
    }, delay);
  };

  const handleRandomize = () => {
    setShowLoadout(true);
    randomizeItem('guns', 2000);
    randomizeItem('helmets', 3000);
    randomizeItem('armor', 4000);
    randomizeItem('rigs', 5000);
    randomizeItem('backpacks', 6000);
    randomizeItem('maps', 7000);
    const selectedMap = randomized.maps;
    if (selectedMap && objectives[selectedMap]) {
      setTimeout(() => randomizeItem('objectives', 8000), 7000);
    }
  };

  // Render a randomized item
  const RenderItem: React.FC<{ label: string; type: string }> = ({ label, type }) => (
    <div className="mb-4">
      <p className="text-2xl font-bold">{label}:</p>
      <p className="text-xl mt-2">{spinning[type] || randomized[type]}</p>
    </div>
  );

  // DropdownItem Component
  const DropdownItem: React.FC<{ label: string; options: string[] }> = ({ label, options }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        {/* Dropdown Button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full text-left bg-gray-700 rounded-lg px-4 py-2 flex justify-between items-center"
        >
          <span>{label}</span>
          <svg
            className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Options */}
        {isOpen && (
          <div className="mt-2 bg-gray-700 rounded-lg px-4 py-2 space-y-2">
            {options.map((option, index) => (
              <label key={index} className="flex items-center">
                <input type="checkbox" className="mr-2 accent-indigo-600" />
                {option}
              </label>
            ))}
          </div>
        )}
      </div>
    );
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

      {/* Customization Section */}
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 border border-white rounded-lg p-4 w-48 text-white">
        <h3 className="text-xl font-bold mb-4 text-center">Customization</h3>
        <div className="flex flex-col space-y-4">
          <DropdownItem label="Guns" options={['Assault Carbines', 'Assault Rifles', 'Bolt-Action', 'Marksman Rifles', 'Shotguns', 'SMGs', 'LMGs', 'Launchers', 'Pistols', 'Revolvers']} />
          <DropdownItem label="Helmets" options={['Hats']} />
          <DropdownItem label="Armor" options={['Enabled']} />
          <DropdownItem label="Rigs" options={['Armored Rigs', 'Unarmored Rigs']} />
          <DropdownItem label="Backpacks" options={['Enabled']} />
          <DropdownItem label="Maps" options={['Enabled']} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow flex flex-col items-center justify-center text-red-500">
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

        {/* Display Loadout */}
        {showLoadout && (
          <div className="mt-6 text-white text-center">
            <RenderItem label="Gun" type="guns" />
            <RenderItem label="Helmet" type="helmets" />
            <RenderItem label="Armor" type="armor" />
            <RenderItem label="Rig" type="rigs" />
            <RenderItem label="Backpack" type="backpacks" />
            <RenderItem label="Map" type="maps" />
            <RenderItem label="Objective" type="objectives" />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default App;
