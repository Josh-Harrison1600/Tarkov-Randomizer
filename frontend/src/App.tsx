import React, { useEffect } from 'react';

const App: React.FC = () => {
  useEffect(() => {
    // Fetch data from the backend
    const fetchGuns = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/guns');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Guns data:', data.guns); // Log data to console
      } catch (error) {
        console.error('Error fetching guns data:', error);
      }
    };

    fetchGuns(); // Call the fetch function
  }, []); // Empty dependency array ensures it runs once when the component is mounted

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Escape from Tarkov Guns</h1>

    </div>
  );
};

export default App;
