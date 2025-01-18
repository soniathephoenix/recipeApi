# John’s Recipe Search App

Ps.: John is a fictious character used to explain the journey building this app.

## Overview
This app was created to practice **DOM manipulation** and working with **APIs**. It allows users to search for recipes based on ingredients. The app fetches meal data from TheMealDB API and dynamically displays recipe information on the page.

To run this app locally, you will need to initialize a new Node.js project and install the necessary dependencies:

```bash
npm init -y
npm install
```

Once you have set up the project, you can start the app and explore how it works.

---

## How John Built the Recipe App

### Step 1: Grabbing the Form
John started by looking at the HTML and noticed a form inside a section with the ID `input-section`. He created a connection to that form in his JavaScript like so:

```javascript
const ingredientForm = document.querySelector("#input-section form");
```

Now, he had a variable, `ingredientForm`, that referred directly to the form. This was the first step in setting up the app.

### Step 2: Preparing the Recipe Display
Next, John knew he'd need a place to display the search results. He grabbed the section with the ID `recipes` and created a variable to reference it:

```javascript
const mealNameDisplay = document.querySelector("#recipes");
```

For displaying detailed recipes, there was also a hidden template with the ID `recipe-template`, so John grabbed that too:

```javascript
const recipeTemplate = document.querySelector("#recipe-template");
```

### Step 3: Setting Up the Form’s Behavior
John didn’t want the page to reload when a user submitted the form. So, he added an event listener to the form to prevent the default behavior:

```javascript
ingredientForm.addEventListener("submit", (e) => {
    e.preventDefault();
});
```

Now, whenever the form was submitted, the page stayed in place, and John had full control over the app's behavior.

### Step 4: Capturing the User’s Input
John knew he needed to get the user’s input from the search bar. He grabbed the search input by its ID, `#search`, and wrote this code inside the event listener:

```javascript
const ingredient = e.target.querySelector("#search").value.trim();
```

This code:
1. Looked at the form that was submitted.
2. Found the search bar inside the form.
3. Retrieved the value typed by the user.
4. Trimmed any unnecessary spaces at the beginning or end of the string.

If the input was valid (not empty), John would proceed to fetch meal data. He also cleared the search bar after each submission:

```javascript
if (ingredient) {
    fetchMealData(ingredient);
    e.target.reset(); // Clear the search bar after submission.
}
```

### Step 5: Fetching Recipes
John needed to fetch meal data from TheMealDB API. So, he wrote the `fetchMealData` function:

```javascript
async function fetchMealData(ingredient) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        const data = await response.json();

        if (data.meals) {
            displayMeals(data.meals);
        } else {
            mealNameDisplay.innerHTML = "<p>No meals found.</p>";
        }
    } catch (err) {
        console.error("Error fetching meal data:", err);
    }
}
```

This function:
1. Made an API request using `fetch`.
2. Converted the response to JSON format.
3. Checked if meals were found. If not, it displayed a “No meals found” message.

### Step 6: Displaying Meals
John needed a way to display the meals returned from the API. He wrote the `displayMeals` function, which dynamically created HTML elements for each meal:

```javascript
function displayMeals(meals) {
    mealNameDisplay.innerHTML = ""; // Clear previous results.

    meals.forEach((meal) => {
        const mealContainer = document.createElement("div");
        const mealImage = document.createElement("img");
        const mealName = document.createElement("p");

        mealImage.src = meal.strMealThumb;
        mealImage.alt = `Image of ${meal.strMeal}`;

        mealName.textContent = meal.strMeal;

        mealContainer.appendChild(mealImage);
        mealContainer.appendChild(mealName);

        mealContainer.addEventListener("click", () => fetchRecipe(meal.idMeal));

        mealNameDisplay.appendChild(mealContainer);
    });
}
```

John used this function to create and display containers for each meal with its image and name. He also added an event listener so users could click on a meal to view the recipe.

### Step 7: Fetching Detailed Recipes
To show a recipe’s details, John wrote another function called `fetchRecipe`. This function made a request to the API for more detailed information about a specific meal using its ID:

```javascript
async function fetchRecipe(mealId) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();

        if (data.meals && data.meals[0]) {
            displayRecipe(data.meals[0]);
        }
    } catch (err) {
        console.error("Error fetching recipe:", err);
    }
}
```

### Step 8: Showing the Recipe
Finally, John created the `displayRecipe` function, which would display the detailed recipe information in the template:

```javascript
function displayRecipe(meal) {
    const titleElement = recipeTemplate.querySelector("#recipe-title");
    const imageElement = recipeTemplate.querySelector("#recipe-image");
    const instructionsElement = recipeTemplate.querySelector("#recipe-instructions");
    const ingredientsList = recipeTemplate.querySelector("#recipe-ingredients");

    titleElement.textContent = meal.strMeal;
    imageElement.src = meal.strMealThumb;
    imageElement.alt = `Image of ${meal.strMeal}`;
    instructionsElement.textContent = meal.strInstructions;

    ingredientsList.innerHTML = ""; // Clear previous ingredients.
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim()) {
            const li = document.createElement("li");
            li.textContent = `${measure || ""} ${ingredient}`;
            ingredientsList.appendChild(li);
        }
    }

    recipeTemplate.style.display = "block";
    recipeTemplate.scrollIntoView({ behavior: "smooth" });
}
```

John used this function to populate the recipe template with the meal’s title, image, instructions, and ingredients. The recipe would smoothly scroll into view when clicked.

---

## Conclusion

By connecting all these pieces together, John successfully built a simple, functional app where users could search for meals by ingredient, view meal options, and click on any meal to view its detailed recipe. It was a clean and user-friendly experience from start to finish!

---
