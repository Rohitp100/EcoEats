import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LOGO from '../components/logo.png';
import './CameraCapture.css';

const Results = () => {
  const location = useLocation();
  const results  = location.state || { ingredients: '', results: { nonVegan: [], harmful: [] } };
  const navigate = useNavigate();

  const handleLOGO = () => {
    navigate('/');
  };

  return (
    <div className="results-container">
      <header className="w-full mb-5 p-4 text-green-700 bg-green-200 bg-opacity-50 text-center">
        <button onClick={handleLOGO}>
          <img src={LOGO} alt="EcoEats Logo" className="mx-auto h-16 border-none" />
        </button>
      </header>
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <h2 className="text-3xl text-green-800 font-semibold mb-4">Results</h2>

        <div className="mb-4 w-full max-w-2xl">
          <h3 className="text-2xl text-green-800 font-semibold mb-2 text-center">Non-Vegan Ingredients</h3>
          <div className="overflow-x-auto whitespace-nowrap border border-green-800 p-2 text-center bg-orange-200 text-red-800">
            {results.nonVegan.length > 0 ? (
              results.nonVegan.map((ingredient, index) => (
                <p key={index} className="inline-block mr-4"><strong>{ingredient}</strong></p>
              ))
            ) : (
              <p>No non-vegan ingredients found.</p>
            )}
          </div>
        </div>

        <div className="mt-4 w-full max-w-2xl">
          <h3 className="text-2xl text-green-800 font-semibold mb-2 text-center">Harmful Ingredients</h3>
          <div className="max-h-64 overflow-y-auto border border-green-800 p-2 text-center bg-orange-200 text-red-800">
            {results.harmful.length > 0 ? (
              results.harmful.map((ingredient, index) => (
                <div key={index} className="mb-4">
                  <h4 className="text-xl font-semibold">{ingredient.name}</h4>
                  <p><strong>Harms:</strong> {ingredient.harms}</p>
                  <p><strong>Daily Limit:</strong> {ingredient.dailyLimit}</p>
                  <p><strong>Who Should Avoid:</strong> {ingredient.whoShouldAvoid}</p>
                </div>
              ))
            ) : (
              <p>No harmful ingredients found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;





