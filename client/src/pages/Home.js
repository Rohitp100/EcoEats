// ecoeats/client/src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import IngredientsInput from '../components/IngredientsInput';
import LOGO from '../components/logo.png';

const Home = () => {
  const [ingredients, setIngredients] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.ocrResult) {
      setIngredients(location.state.ocrResult);
    }
  }, [location.state]);

  const handleScan = () => {
    navigate('/scanner');
  };

  const handleCheck = async () => {
    if(!ingredients) return;
    try {
      const response = await fetch('http://localhost:5001/api/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });
  
      if (!response.ok) {
        // Log the status code and response body
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      navigate('/results', { state: { ingredients, results: data.details } });
    } catch (error) {
      console.error('Error checking ingredients:', error.message);
      alert('An error occurred while checking ingredients. Please try again.');
    }
  };
  
  

  const handleLOGO = () => {
    navigate('/');
  };

  return (
    <div 
    className="flex flex-col items-center justify-center min-h-screen">
      <header className="w-full p-4 text-green-700 bg-green-200 bg-opacity-50 text-center"> {/* Transparent navbar */}
      <button onClick={handleLOGO}>
        <img src={LOGO} alt="EcoEats Logo" className="mx-auto h-16 border-none" />
        </button>
      </header>
      <main className="flex flex-col items-center justify-center flex-1 p-4">
        <h2 className="text-2xl text-green-600 font-semibold mb-4">Welcome to EcoEats</h2>
        <p className="text-center text-green-700 mb-4">Scan or enter ingredients to check for harmful and non-vegan ingredients.</p>
        <IngredientsInput ingredients={ingredients} setIngredients={setIngredients} />
        <div className="flex space-x-4">
          <button
            onClick={handleScan}
            className="px-4 btn py-2 bg-orange-600 text-white rounded hover:bg-red-600"
          >
            Scan Ingredients
          </button>
        </div>
        <div className="mt-4">
          <button
            onClick={handleCheck}
            disabled={!ingredients}
            className="px-4 btn py-2 bg-orange-600 text-white rounded hover:bg-red-600"
          >
            Check
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
