const dietaryRestriction = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const infoBox = document.getElementById("infoBox");
const resultsDiv = document.getElementById("results");
const dietaryRestrictions = document.getElementById("dietList");
const ingredientInput = document.getElementById("ingredientInput");
const ingredientButton = document.getElementById("ingredientButton");
const validIngredients = new Set();
const ingredientDiv = document.getElementById("ingredientList");
const strictSearch = document.getElementById("strictSearch");
let ingredientList = new Set();

loadIngredients();
searchButton.addEventListener('click', searchRecipes);
ingredientButton.addEventListener('click', addIngredient);



function searchRecipes(){
    const restrictions = dietaryRestrictions.value;
    const query = dietaryRestriction.value.trim();
    if(!query){
        alert('Please enter a search term');
        return;
    }

    const apiUrl = `/recipes?query=${encodeURIComponent(query)}`;;

    infoBox.innerHTML = '<p>Searching for recipes...</p>';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            resultsDiv.innerHTML = '';
            if (!data.results || data.results.length ===0){
                infoBox.innerHTML = '<div class = "no results">No recipes found. Try a different search term!</div>';
                return;
            }
            data.results.forEach(recipe => {
                addRecipes(restrictions, recipe);
            })
            infoBox.textContent = "Recipes found! Click on a recipe for more information";
        })
        .catch(error => {
            console.error('Error fetching recipes', error);
            infoBox.innerHTML = '<div class="error">An error occurred while fetching recipes. Please try again.</div>';
        })
    }

function addRecipes(restrictions, recipe){
    const title = recipe.title;
    const image = recipe.image;
    const diets = recipe.diets;

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
                resultsDiv.appendChild(recipeDiv);
                console.log(recipe);

                 recipeDiv.addEventListener('click', ()=>{
                infoBox.innerHTML = `<h3>${title}</h3>
                <img src="${image}" alt="${title}" style="max-width: 100%;">
                <p><strong>Diets:</strong> ${diets.join(', ') || 'None'}</p>
                <p><strong>Ingredients:</strong> ${Array.from(ingredients).join(', ')}</p>`;
                });
                resultsDiv.appendChild(recipeDiv);
            }
            
}

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

function checkDiet(foodDiets, restrictions){
    if(restrictions == "none"||foodDiets.includes(restrictions)){
        return true;
    }
    else {
        return false;
    }
}

async function loadIngredients(){
    try{
        const response = await fetch("ingredients-with-possible-units.csv");
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

async function checkIngredientExists(ingredient){
    return validIngredients.has(ingredient.toLowerCase());
}

async function addIngredient(){
    let ingredient = ingredientInput.value.trim().toLowerCase();
    ingredientInput.value = "";

    if(!ingredient){
        alert("Please enter an ingredient!");
        return;
    }
    if(ingredientList.has(ingredient)){
        alert("Ingredient already added!");
        return;
    }
    
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

function removeIngredient(ingredient){
    let ingredientDiv = document.getElementById(`${ingredient}Div`)
    if(ingredientDiv){
        ingredientDiv.remove();
        ingredientList.delete(ingredient);
    }
    else{
        console.log("Attempted to remove not present ingredient");
    }
}