// client/src/components/IngredientsInput.js
import React from 'react';

const IngredientsInput = ({ ingredients, setIngredients }) => {
  const clearText = () => {
    setIngredients('');
  };

  return (
    <div className="relative w-full">
      <textarea
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="Enter ingredients here..."
        className="w-full p-2 border rounded text-green-800 bg-orange-200 border-green-800"
        rows="5"
      />
      <button
        onClick={clearText}
        className="absolute right-2 bottom-2 px-2 py-1 bg-green-300 text-green-900 rounded"
      >
        Clear
      </button>
    </div>
  );
};

export default IngredientsInput;
