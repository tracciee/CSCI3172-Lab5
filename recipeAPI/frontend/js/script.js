const dietaryRestriction = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const infoBox = document.getElementById("infoBox");
const resultsDiv = document.getElementById("results");
const dietaryRestrictions = document.getElementById("dietList");
const ingredientInput = document.getElementById("ingredientInput");
const ingredientButton = document.getElementById("ingredientButton");
const validIngredients = new Set();
const ingredientDiv = document.getElementById("ingredientList");
let ingredientList = new Set();

loadIngredients();
searchButton.addEventListener('click', searchRecipes);
ingredientButton.addEventListener('click', addIngredient);


//Function called when clicking the search button, begins search
function searchRecipes(){
    const restrictions = dietaryRestrictions.value;
    const query = dietaryRestriction.value.trim();
    
    //Error checking
    if(!query){
        alert('Please enter a search term');
        return;
    }
    if(!/^[a-zA-Z\s]+$/.test(query)){
        alert("Search can only contain letters and spaces");
        return;
    }

    const apiUrl = `./api/recipes?query=${encodeURIComponent(query)}`;;

    infoBox.innerHTML = '<p>Searching for recipes...</p>';

    //Fetches the API and initions the recipe adding
    fetch(apiUrl)
        .then(response => {
            if(!response.ok){
                throw new Error("API Request Failure");
            }
            return response.json();
        })
        .then(data => {
            resultsDiv.innerHTML = '';
            if (!data.results || data.results.length ===0){
                infoBox.innerHTML = '<div class = "no results">No recipes found. Try a different search term!</div>';
                return;
            }
            data.results.forEach(recipe => {
                addRecipes(restrictions, recipe);
            })
            infoBox.innerHTML = '<div class = "success"> Recipes found! Click on a recipe for more information </div>';
        })
        .catch(error => {
            console.error('Error fetching recipes', error);
            infoBox.innerHTML = '<div class="error">An error occurred while fetching recipes. Please try again.</div>';
        })
    }

//Function adds a recipe to the page
function addRecipes(restrictions, recipe){
    const title = recipe.title;
    const image = recipe.image;
    const diets = recipe.diets;

    //error checking
    if(!recipe.nutrition || !recipe.nutrition.ingredients){
        console.log(`Missing nutritional data for ${title}`)
        return;
    }

    const ingredients = new Set(
        recipe.nutrition.ingredients.map(i => i.name.toLowerCase())
    );

    console.log(restrictions);
    console.log(diets);

    if(checkDiet(diets, restrictions) && checkIngredientsMatch(ingredients)){  
            console.log(recipe);
            const recipeDiv = document.createElement('div');
            recipeDiv.className = 'recipe';
            recipeDiv.innerHTML = `
                <h3>${title}</h3>
                <img src="${image}" alt="${title}">
                `;
                console.log(recipe);

                 recipeDiv.addEventListener('click', ()=>{
                    infoBox.innerHTML = `<h3>${title}</h3>
                    <img src="${image}" alt="${title}" style="max-width: 100%;">
                    <p><strong>Diets:</strong> ${diets.join(', ') || 'None'}</p>
                    <p><strong>Ingredients:</strong> ${Array.from(ingredients).join(', ')}</p>`;
                    window.scroll(0, 0);
                });
                resultsDiv.appendChild(recipeDiv);
            }    
}

//Checks the ingredients match what's in the user's list
function checkIngredientsMatch(foodIngredients){
    if(ingredientList.size != 0){
        for(const ingredient of ingredientList){
            let foundMatch = false;
            for(const foodIngredient of foodIngredients){
                if(foodIngredient.includes(ingredient)){
                    foundMatch = true;
                    break;
                }
            }
            if(!foundMatch){
                return false;
            }
        }
    }
    return true;
}

//Checks that the food meets the user's dietary restrictions
function checkDiet(foodDiets, restrictions){
    if(restrictions == "none"||foodDiets.includes(restrictions)){
        return true;
    }
    else {
        return false;
    }
}

//Loads the ingredients CSV for checking
async function loadIngredients(){
    try{
        const response = await fetch("ingredients-with-possible-units.csv");
        if(!response.ok){
            throw new Error("Failed to load Ingredient CSV");
        }

        const text = await response.text();
        const lines = text.split("\n");

        lines.forEach(line => {
            const name = line.split(";")[0].trim().toLowerCase();
            validIngredients.add(name);
        })
        console.log("Loaded ingredients");
    }
    catch(err){
        console.log("Failed to load ingredients");
    }
}

//Checks that an ingredient is valid
async function checkIngredientExists(ingredient){
    return validIngredients.has(ingredient.toLowerCase());
}

//Adds an ingredient to the ingredients list and set
async function addIngredient(){
    let ingredient = ingredientInput.value.trim().toLowerCase();
    ingredientInput.value = "";

    //error checking
    if(!ingredient){
        alert("Please enter an ingredient!");
        return;
    }
    if(ingredientList.has(ingredient)){
        alert("Ingredient already added!");
        return;
    }
    if(!/^[a-zA-Z\s]+$/.test(ingredient)){
        alert("Ingredient must only contain letters");
        return;
    }
    
    //Creates an ingredient element on the page
    const exists = await checkIngredientExists(ingredient);
    if(exists){
        const ingredientItem = document.createElement("div");
        ingredientItem.className = "ingredientItem";
        const ingredientName = document.createElement("p");
        const ingredientDelete = document.createElement("button");
        ingredientDelete.className = `deleteButton btn btn-sm btn-danger ms-2`;
        ingredientItem.id = `${ingredient}Div`;
        ingredientName.innerHTML = ingredient;
        ingredientDelete.addEventListener('click', () => removeIngredient(ingredient));
        ingredientDelete.textContent = "Remove";
        ingredientItem.appendChild(ingredientName);
        ingredientItem.appendChild(ingredientDelete);
        ingredientDiv.appendChild(ingredientItem);
        ingredientList.add(ingredient);
    }
    else{
        alert("Invalid ingredient!");
        return;
    }
    console.log(ingredientList);
}

//Removes an ingredient from the page and the set
function removeIngredient(ingredient){
    let ingredientElement = document.getElementById(`${ingredient}Div`)
    if(ingredientElement){
        ingredientElement.remove();
        ingredientList.delete(ingredient);
    }
    else{
        console.log("Attempted to remove not present ingredient");
    }
}

module.exports = {
  checkDiet,
  checkIngredientsMatch,
};