// client/src/components/resultBox.js
import React from 'react';

const ResultBox = ({ ingredientInfo }) => {
  return (
    <div className="w-full p-2 border rounded results-container text-green-800 bg-orange-200 border-green-800 mt-4 h-32 max-h-96 overflow-y-auto">
      {ingredientInfo && ingredientInfo.length > 0 ? (
        <div>
          <h3 className="text-xl text-green-600">Ingredient Daily Upper Limits:</h3>
          <ul>
            {ingredientInfo.map((info, index) => (
              <li key={index} className="mb-4">
                <h4 className="font-semibold">{info.name}</h4>
                {/* Display quantity information (per 100g) */}
                <p className="text-sm text-gray-600">
                  Quantity per 100g: {info.amount} {info.unit}
                </p>
                <ul>
                  {info.nutrition.nutrients.map((nutrient, i) => (
                    <li key={i}>
                      {nutrient.name}: {nutrient.percentOfDailyNeeds.toFixed(2)}% of daily needs
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No ingredient information available.</p>
      )}
    </div>
  );
};

export default ResultBox;
