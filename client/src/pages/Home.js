// ecoeats/client/src/pages/Home.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import IngredientsInput from '../components/IngredientsInput';
import ResultBox from '../components/ResultBox'; 
import LOGO from '../components/logo.png';

const Home = () => {
  const [ingredients, setIngredients] = useState('');
  const [ingredientInfo, setIngredientInfo] = useState([]); 
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
    if (!ingredients) return;
  
    const ingredientsList = ingredients.split(',').map(item => item.trim());
  
    try {
      const results = await Promise.all(
        ingredientsList.map(async (ingredient) => {
          const searchResponse = await fetch(
            `http://localhost:5000/ingredients/search?query=${ingredient}`
          );
  
          if (!searchResponse.ok) {
            throw new Error(`Failed to search for ingredient: ${ingredient}`);
          }
  
          const searchData = await searchResponse.json();
  
          if (searchData.results.length === 0) {
            throw new Error(`Ingredient not found: ${ingredient}`);
          }
  
          const ingredientId = searchData.results[0].id;
          const ingredientResponse = await fetch(
            `http://localhost:5000/ingredients/${ingredientId}/information?amount=100`
          );
  
          if (!ingredientResponse.ok) {
            throw new Error(`Failed to fetch data for ${ingredient}`);
          }
  
          const ingredientData = await ingredientResponse.json();
          return ingredientData;
        })
      );
  
      setIngredientInfo(results);
      console.log(results); 
    } catch (error) {
      console.error('Error fetching ingredient information:', error);
    }
  };
  

  const handleLOGO = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <header className="w-full p-4 text-green-700 bg-green-200 bg-opacity-50 text-center">
        {/* Transparent navbar */}
        <button onClick={handleLOGO}>
          <img src={LOGO} alt="EcoEats Logo" className="mx-auto h-16 border-none" />
        </button>
      </header>
      <main className="flex flex-col items-center justify-center flex-1 p-4">
        <h2 className="text-2xl text-green-600 font-semibold mb-4">Welcome to EcoEats</h2>
        <p className="text-center text-green-700 mb-4">Scan or enter ingredients to check for upper limit of the ingredients used.</p>
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
        <ResultBox ingredientInfo={ingredientInfo} /> 

      </main>
    </div>
  );
};

export default Home;














