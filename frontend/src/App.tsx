import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import Footer from './Footer';

const App: React.FC = () => {
  // State for items fetched from the API
  const [items, setItems] = useState<Record<string, any>>({
    guns: {
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
    },
    helmets: { armored: [], vanity: [] },
    armor: [],
    rigs: { Armored: [], Unarmored: [] },
    backpacks: [],
    maps: ["Customs", "Factory", "Shoreline", "Interchange", "Reserve", "Woods", "The Lab", "Lighthouse", "Streets of Tarkov", "Ground Zero"]
  });

  // State for randomized items
  const [randomized, setRandomized] = useState<Record<string, string | null>>({
    guns: null,
    helmets: null,
    armor: null,
    rigs: null,
    backpacks: null,
    maps: null
  });

  // State for spinning animation during randomization
  const [spinning, setSpinning] = useState<Record<string, string | null>>({
    guns: null,
    helmets: null,
    armor: null,
    rigs: null,
    backpacks: null,
    maps: null
  });

  // State for selected gun types (for filtering)
  const [selectedGunTypes, setSelectedGunTypes] = useState<string[]>([]);

  // Whether to include hats in the helmet randomization
  const [includeHats, setIncludeHats] = useState(false);

  // State to show the randomized loadout
  const [showLoadout, setShowLoadout] = useState(false);

  // State to manage whether dropdowns are open or closed
  const [dropdownStates, setDropdownStates] = useState<Record<string, boolean>>({
    guns: false,
    helmets: false,
    armor: false,
    rigs: false,
    backpacks: false,
    maps: false,
  });

  // Background video URL from environment variables
  const videoUrl = import.meta.env.VITE_API_S3;

  // Fetch items from the API for a given type
  const fetchItems = async (itemType: string) => {
    try {
      const response = await fetch(`https://tarkov-randomizer.vercel.app/api/${itemType}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      return data[itemType];
    } catch (error) {
      console.error(`Error fetching ${itemType} data:`, error);
      return [];
    }
  };

  // Fetch all items on component mount
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

      // Populate selectedGunTypes with all gun categories by default
      setSelectedGunTypes(Object.keys(guns || {}));
    };
    fetchAllItems();
  }, []);

  const [componentStatus, setComponentStatus] = useState<Record<string, boolean>>({
    guns: true,
    helmets: true,
    armor: true,
    rigs: true,
    armoredRigs: false,
    unarmoredRigs: true,
    backpacks: true,
    maps: true,
  });

  const randomizeItem = (type: string, delay: number) => {
    if (!componentStatus[type]) return;

    let itemsToPick = items[type];

    // Special logic for guns (filter by selected types)
    if (type === 'guns') {
      itemsToPick = Object.entries(items.guns)
        .filter(([key]) => selectedGunTypes.includes(key))
        .flatMap(([, values]) => values);
    }

    // Special logic for helmets (combine categories based on "includeHats")
    if (type === 'helmets') {
      itemsToPick = includeHats
        ? [...items.helmets.armored, ...items.helmets.vanity]
        : items.helmets.armored;
    }

    // Skip armor randomization if it's not enabled
    if (type === 'armor' && !componentStatus.armor) {
      return; 
    }

    if (type === 'rigs') {
      if (componentStatus.armoredRigs && !componentStatus.unarmoredRigs) {
        itemsToPick = items.rigs.Armored;
      } else if (componentStatus.unarmoredRigs && !componentStatus.armoredRigs) {
        itemsToPick = items.rigs.Unarmored;
      } else {
        itemsToPick = [];
      }
    }

    if (itemsToPick.length === 0) return;

    let index = 0;
    const interval = setInterval(() => {
      setSpinning((prev) => ({ ...prev, [type]: itemsToPick[index] }));
      index = (index + 1) % itemsToPick.length;
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const randomIndex = Math.floor(Math.random() * itemsToPick.length);
      setRandomized((prev) => ({ ...prev, [type]: itemsToPick[randomIndex] }));
      setSpinning((prev) => ({ ...prev, [type]: null }));
    }, delay);
  };

  // Handle the randomization process for all item types
  const handleRandomize = () => {
    if (selectedGunTypes.length === 0) {
      window.alert('No gun category selected!');
      return;
    }

    if (componentStatus.armor && componentStatus.armoredRigs) {
      window.alert('You cannot select both Armor and Armored Rigs at the same time!');
      return;
    }
    

    setShowLoadout(true);
    randomizeItem('guns', 2000);
    randomizeItem('helmets', 3000);
    randomizeItem('armor', 4000);
    randomizeItem('rigs', 5000);
    randomizeItem('backpacks', 6000);
    randomizeItem('maps', 7000);
  };

  // Render a randomized item
  const RenderItem: React.FC<{ label: string; type: string }> = ({ label, type }) => (
    <div className="mb-4">
      <p className="text-2xl font-bold">{label}:</p>
      <p className="text-xl mt-2">{spinning[type] || randomized[type]}</p>
    </div>
  );

  const DropdownWithToggle: React.FC<{
    label: string;
    type: string;
    options: string[];
  }> = ({ label, type, options }) => (
    <div className="flex items-center space-x-2">
      <DropdownItem label={label} type={type} options={options} />
    </div>
  );

  const DropdownItem: React.FC<{ label: string; type: string; options: string[] }> = ({
    label,
    type,
    options,
  }) => {
    const isOpen = dropdownStates[type];
  
    // Handle checkbox changes
    const handleCheckboxChange = (option: string) => {
      if (type === 'rigs') {
        if (option === 'Armored Rigs') {
          setComponentStatus((prev) => ({
            ...prev,
            armoredRigs: !prev.armoredRigs,
            unarmoredRigs: false,
          }));
        } else if (option === 'Unarmored Rigs') {
          setComponentStatus((prev) => ({
            ...prev,
            unarmoredRigs: !prev.unarmoredRigs,
            armoredRigs: false,
          }));
        }
      } else if (type === 'armor' && option === 'Enabled') {
        setComponentStatus((prev) => ({ ...prev, armor: !prev.armor }));
      } else if (type === 'helmets' && option === 'Hats') {
        setIncludeHats((prev) => !prev);
      } else if (type === 'guns') {
        setSelectedGunTypes((prev) =>
          prev.includes(option)
            ? prev.filter((gunType) => gunType !== option) // Remove if already selected
            : [...prev, option] // Add if not selected
        );
      } else if (type === 'maps' || type === 'backpacks') {
        setComponentStatus((prev) => ({ ...prev, [type]: !prev[type] }));
      }
    };
  
    return (
      <div className="relative">
        {/* Dropdown Button */}
        <button
          onClick={() =>
            setDropdownStates((prev) => ({
              ...prev,
              [type]: !prev[type],
            }))
          }
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
          <div
            className="mt-2 bg-gray-700 rounded-lg px-4 py-2 space-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            {options.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  id={`${type}-${option}`} 
                  type="checkbox"
                  value={option}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  onChange={() => handleCheckboxChange(option)}
                  checked={
                    (type === 'armor' && option === 'Enabled' && componentStatus.armor) ||
                    (type === 'helmets' && option === 'Hats' && includeHats) ||
                    (type === 'rigs' && option === 'Armored Rigs' && componentStatus.armoredRigs) ||
                    (type === 'rigs' && option === 'Unarmored Rigs' && componentStatus.unarmoredRigs) ||
                    (type === 'guns' && selectedGunTypes.includes(option))
                  }
                />
                <label
                  htmlFor={`${type}-${option}`}
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {option}
                </label>
              </div>
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

      {/* Customization Menu */}
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 border border-white rounded-lg p-4 w-64 ml-4 text-white mt-4 hover:bg-gray-900 transition duration-300">
        <h3 className="text-xl font-bold mb-4 text-center">Customization</h3>
        <div className="flex flex-col items-center space-y-4">
          <DropdownWithToggle label="Guns" type="guns" options={Object.keys(items.guns)} />
          <DropdownWithToggle label="Helmets" type="helmets" options={['Hats']} />
          <DropdownWithToggle label="Armor" type="armor" options={['Enabled']} />
          <DropdownWithToggle
            label="Rigs"
            type="rigs"
            options={['Armored Rigs', 'Unarmored Rigs']}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <button
          onClick={handleRandomize}
          className="mt-8 px-6 py-3 border-2 border-blue-500 text-blue-500 text-xl hover:bg-blue-500 hover:text-white transition duration-300"
        >
          <span className="relative font-bold">Generate Loadout</span>
        </button>

        {/* Display Loadout */}
        {showLoadout && (
          <div className="mt-6 text-white text-center">
            <RenderItem label="Gun" type="guns" />
            <RenderItem label="Helmet" type="helmets" />
            {componentStatus.armor && <RenderItem label="Armor" type="armor" />}
            <RenderItem label="Rig" type="rigs" />
            <RenderItem label="Backpack" type="backpacks" />
            <RenderItem label="Map" type="maps" />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default App;
