import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { db } from '../firebase/firebase';
import Button from 'react-bootstrap/Button';
import Logout from './Logout'; 
import { Link } from 'react-router-dom'; 
import './MealSearch.css';

const MealSearch = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchClicked, setSearchClicked] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      let termToSearch = searchTerm;

      // Use the selected history item if available
      if (selectedHistoryItem) {
        termToSearch = selectedHistoryItem.term;
      }

      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${termToSearch}`
      );

      if (user && !selectedHistoryItem) {
        await db.collection('searchHistory').add({
          user: user.uid,
          searchTerm,
          timestamp: new Date(),
        });
      }

      const meals = response.data.meals || [];

      setRecipes(meals);
      setSearchHistory((prevHistory) => [
        { term: termToSearch, timestamp: new Date() },
        ...prevHistory,
      ]);

      setSearchTerm('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
      setSelectedHistoryItem(null); // Reset selected history item after search
    }
  };

  const handleHistoryItemClick = (historyItem) => {
    setSearchTerm(historyItem.term);
    setSelectedHistoryItem(historyItem); // Set the selected history item
    setSearchClicked(true);
  };

  useEffect(() => {
    if (searchClicked) {
      handleSearch();
      setSearchClicked(false);
    }
  }, [searchClicked]);

  return (
    <div className="meal-search-container">
      {/* Sign In and Sign Up buttons */}
      <div className="auth-buttons">
        {!user && (
          <>
            <Link to="/signin">
              <Button variant="primary">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary">Sign Up</Button>
            </Link>
          </>
        )}
      </div>

      <h2>Welcome to Meal Search</h2>
      <div className="search-input-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a meal..."
        />
        <Button
          onClick={() => {
            setSearchClicked(true);
          }}
          disabled={loading || searchTerm === ''}
          variant="primary"
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {/* Display Search History */}
      <ul className="search-history">
        {searchHistory
          .filter(
            (historyItem, index, self) =>
              index ===
              self.findIndex((item) => item.term === historyItem.term)
          )
          .map((historyItem) => (
            <li
              key={historyItem.timestamp}
              onClick={() => handleHistoryItemClick(historyItem)}
            >
              {historyItem.term}
            </li>
          ))}
      </ul>

      {/* Display Recipes */}
      <div>
        <h3>Recipes</h3>
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.idMeal}>
              <img src={recipe.strMealThumb} alt={recipe.strMeal} />
              <h4>{recipe.strMeal}</h4>
              <p>Category: {recipe.strCategory}</p>
              <p>Instructions: {recipe.strInstructions}</p>
              <p>Ingredients:</p>
              <ul>
                {Array.from({ length: 20 }, (_, index) => index + 1).map(
                  (index) => {
                    const ingredient = recipe[`strIngredient${index}`];
                    const measure = recipe[`strMeasure${index}`];

                    if (ingredient && measure) {
                      return (
                        <li key={index}>{`${ingredient} - ${measure}`}</li>
                      );
                    }

                    return null;
                  }
                )}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout button */}
      <Logout />
    </div>
  );
};

export default MealSearch;