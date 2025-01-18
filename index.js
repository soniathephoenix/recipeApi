// Step 1: Script execution begins (runs after the HTML is parsed due to the "defer" attribute).
// Select key elements in the DOM for later use.
const ingredientForm = document.querySelector("#input-section form"); // The form for ingredient search.
const mealNameDisplay = document.querySelector("#recipes"); // The section where meals will be displayed.
const recipeTemplate = document.querySelector("#recipe-template"); // The template for displaying detailed recipe information.

// Step 2: Attach a 'submit' event listener to the form.
ingredientForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Step 3: Prevent the default form submission behavior (prevents page reload).

    const ingredient = e.target.querySelector("#search").value.trim(); // Step 4: Read and trim the user input.
    if (ingredient) {
        fetchMealData(ingredient); // Step 5: If the input is valid, fetch meal data using the ingredient.
        e.target.reset(); // Step 6: Clear the input field after submission.
    }
});

// Step 7: Define a function to fetch meal data from the API using the entered ingredient.
async function fetchMealData(ingredient) {
    try {
        // Step 8: Fetch meals containing the searched ingredient from the API.
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        const data = await response.json(); // Step 9: Parse the response into JSON format.

        // Step 10: Check if meals are found in the API response.
        if (data.meals) {
            displayMeals(data.meals); // Step 11: Call displayMeals() to show the fetched meals.
        } else {
            // Step 12: If no meals are found, display a "No meals found" message.
            mealNameDisplay.innerHTML = "<p>No meals found.</p>";
        }
    } catch (err) {
        console.error("Error fetching meal data:", err); // Step 13: Handle any fetch errors.
    }
}

// Step 14: Define a function to display meals fetched from the API.
function displayMeals(meals) {
    mealNameDisplay.innerHTML = ""; // Step 15: Clear any previous results in the mealNameDisplay container.

    meals.forEach((meal) => {
        // Step 16: For each meal, create a container to display its information.
        const mealContainer = document.createElement("div"); // Container for a single meal.
        const mealImage = document.createElement("img"); // Image element for the meal thumbnail.
        const mealName = document.createElement("p"); // Paragraph element for the meal name.

        // Step 17: Set the image's source, alt text, and fallback handler.
        mealImage.src = meal.strMealThumb;
        mealImage.alt = `Image of ${meal.strMeal}`;

        // Step 18: Set the meal name text.
        mealName.textContent = meal.strMeal;

        // Step 19: Append the image and name to the meal container.
        mealContainer.appendChild(mealImage);
        mealContainer.appendChild(mealName);

        // Step 20: Add a 'click' event listener to fetch and display the recipe when clicked.
        mealContainer.addEventListener("click", () => fetchRecipe(meal.idMeal));

        // Step 21: Append the meal container to the mealNameDisplay section.
        mealNameDisplay.appendChild(mealContainer);
    });
}

// Step 22: Define a function to fetch detailed recipe information using the meal ID.
async function fetchRecipe(mealId) {
    try {
        // Step 23: Fetch the detailed recipe data from TheMealDB API.
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json(); // Step 24: Parse the response into JSON format.

        // Step 25: Check if a valid recipe is found in the API response.
        if (data.meals && data.meals[0]) {
            displayRecipe(data.meals[0]); // Step 26: Call displayRecipe() to show the detailed recipe.
        }
    } catch (err) {
        console.error("Error fetching recipe:", err); // Step 27: Handle any fetch errors.
    }
}

// Step 28: Define a function to display detailed recipe information.
function displayRecipe(meal) {
    // Step 29: Populate the recipeTemplate elements with recipe details.
    const titleElement = recipeTemplate.querySelector("#recipe-title");
    const imageElement = recipeTemplate.querySelector("#recipe-image");
    const instructionsElement = recipeTemplate.querySelector("#recipe-instructions");
    const ingredientsList = recipeTemplate.querySelector("#recipe-ingredients");

    // Step 30: Update the template's title, image, and instructions with the recipe data.
    titleElement.textContent = meal.strMeal;
    imageElement.src = meal.strMealThumb;
    imageElement.alt = `Image of ${meal.strMeal}`;
    instructionsElement.textContent = meal.strInstructions;

    // Step 31: Clear and populate the ingredient list.
    ingredientsList.innerHTML = ""; // Clear any existing ingredients.
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`]; // Ingredient name.
        const measure = meal[`strMeasure${i}`]; // Ingredient measurement.

        if (ingredient && ingredient.trim()) {
            const li = document.createElement("li"); // Create a list item for the ingredient.
            li.textContent = `${measure || ""} ${ingredient}`; // Add ingredient and measurement.
            ingredientsList.appendChild(li); // Append to the list.
        }
    }

    // Step 32: Display the recipeTemplate and scroll to it smoothly.
    recipeTemplate.style.display = "block";
    recipeTemplate.scrollIntoView({ behavior: "smooth" });
}
