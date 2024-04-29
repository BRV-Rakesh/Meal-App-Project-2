const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const favMealsBtn = document.querySelector('.fav-btn');
const favModal = document.getElementById('favModal');
const closeModalBtn = document.querySelector('.close');
// Event listeners
searchBtn.addEventListener('click', getMealList);
// Get meal list that matches with the ingredients
function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
        .then(response => response.json())
        .then(data => {
            let html = "";
            if (data.meals) {
                data.meals.forEach(meal => {
                    html += `
                    <div class="meal-item" data-id="${meal.idMeal}">
                        <div class="meal-img">
                            <img class="card-img-top" src="${meal.strMealThumb}" id="img"  alt="food">
                        </div>
                        <div class="meal-name" id="name">
                            <h3>${meal.strMeal}</h3>
                            
                            <a href="#" class="recipe-btn">View Recipe</a>
                            <button class="favorite-btn">Add to Favorites</button>
                        </div>
                    </div>
                    `;
                });
                mealList.classList.remove('notFound');
            }
            else {
                html = "Oops! Search Result not found. Please enter a valid ingredient.";
                mealList.classList.add('noMatch');
            }
            mealList.innerHTML = html;
        });
}
// Event delegation for dynamic elements
mealList.addEventListener('click', getMealRecipe);
mealList.addEventListener('click', addToFavorites);

// Get meal recipe modal
function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => mealRecipeModal(data.meals));    
    }
}
// Add meal to favorites
function addToFavorites(e) {
    if (e.target.classList.contains('favorite-btn')) {
        const mealItem = e.target.parentElement.parentElement;
        const mealId = mealItem.dataset.id;
        const favoriteMeals = JSON.parse(localStorage.getItem('favoriteMeals')) || [];
        if (favoriteMeals.includes(mealId)) {
            alert('This meal is already in your favorites!');
        } else {
            favoriteMeals.push(mealId);
            localStorage.setItem('favoriteMeals', JSON.stringify(favoriteMeals));
            alert('Meal added to favorites!');
        }
    }
}
// Modal-Display meal recipe modal
function mealRecipeModal(meal) {
    meal = meal[0];
    let html = `
    <h2 class="recipe-title">${meal.strMeal}</h2>
    <p class="recipe-category">${meal.strCategory}</p>
    <div class="recipe-instruct">
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
    </div>
    <div class="recipe-meal-img">
        <img src="${meal.strMealThumb}" alt="">
    </div>
    <div class="recipe-link">
        <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
    </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}
//Event Listener
favMealsBtn.addEventListener('click', () => {
  showFavoriteMeals();
  favModal.style.display = 'block';
});

closeModalBtn.addEventListener('click', () => {
  favModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === favModal) {
    favModal.style.display = 'none';
  }
});
// Show favorite meals in the modal
function showFavoriteMeals() {
    const favoriteMeals = JSON.parse(localStorage.getItem('favoriteMeals')) || [];
    let html = '';
    if (favoriteMeals.length === 0) {
        html = 'You have no favorite meals yet.';
    } else {
        html = '<ul>';
        favoriteMeals.forEach(mealId => {
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
                .then(response => response.json())
                .then(data => {
                    const meal = data.meals[0];
                    html += `
                        <li>
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                            <span>${meal.strMeal}</span>
                            <button class="remove-btn" data-id="${meal.idMeal}">Remove</button>
                        </li>
                    `;
                    document.getElementById('favorite-meals-list').innerHTML = html;
                });
        });
        html += '</ul>';
    }
    document.getElementById('favorite-meals-list').innerHTML = html;
}
// Event listener for removing favorite meals
favModal.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-btn')) {
        const mealIdToRemove = event.target.dataset.id;
        let favoriteMeals = JSON.parse(localStorage.getItem('favoriteMeals')) || [];
        favoriteMeals = favoriteMeals.filter(id => id !== mealIdToRemove);
        localStorage.setItem('favoriteMeals', JSON.stringify(favoriteMeals));
        showFavoriteMeals(); // Reload favorite meals in modal
        alert('Meal removed from favorites!');
    }
});
//Close button
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});