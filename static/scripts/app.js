document.addEventListener("DOMContentLoaded", function() {
    formStuff();
    loadStuff();
});

async function loadStuff() {
    try {
        const response = await fetch("/api/recipes", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });

        const recipes = await response.json();
        console.log("Success", recipes);
        recipes.forEach((recipe) => {
            addRecipeToList(recipe);
        });

    } catch(error) {
        console.error("Error:", error);
    }       
}

function formStuff() {
    document.getElementById("create-recipe-form").addEventListener("submit", async function(event){
        event.preventDefault();

        const recipeName = document.getElementById("recipe-name").value;
        
        const stepListItems = document.querySelectorAll("#step-ul li input");
        const ingredientListItems = document.querySelectorAll("#ingredients-ul li input");
        
        let stepArr = [];
        let ingredientArr = [];

        stepListItems.forEach((input) => {
            stepArr.push(input.value);
            input.value = "";
        });

        ingredientListItems.forEach((input) => {
            ingredientArr.push(input.value);
            input.value = "";
        });

        // Remove extra buttons
        document.querySelectorAll("#ingredients-ul li, #step-ul li").forEach(li => {
            li.remove();
        });

        try {
            const response = await fetch("/api/recipes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "name": recipeName,
                    "steps": stepArr,
                    "ingredients": ingredientArr
                })
            });

            const result = await response.json();
            console.log("Success", result);
            addRecipeToList(result.data);

            document.getElementById("recipe-name").value = "";
        } catch(error) {
            document.getElementById("recipe-name").value = "";
            console.error("Error:", error);
        }   
    });
}

function addRecipeToList(recipeJSON) {
    let content = document.getElementById("content");

    let data = recipeJSON;

    let div = document.createElement("div");
    div.classList.add("recipe-card");
    div.dataset.recipeId = data.id; // Store the recipe ID for updates/deletes

    let header = document.createElement("h2");
    header.textContent = data.name;
    div.appendChild(header);    

    let listContainer = document.createElement("section");
    listContainer.classList.add("list-container");

    // Ingredients section
    let ingredientSection = document.createElement("div");
    ingredientSection.classList.add("ingredients-section");

    let ingredientHeader = document.createElement("h3");
    ingredientHeader.textContent = "Ingredients";
    ingredientSection.appendChild(ingredientHeader);

    let ingredientList = document.createElement("ul");
    ingredientList.classList.add("ingredient-list");

    data.ingredients.forEach((ingredient) => {
        let li = document.createElement("li");
        li.textContent = ingredient;
        ingredientList.appendChild(li);
    });

    ingredientSection.appendChild(ingredientList);
    listContainer.appendChild(ingredientSection);

    // Steps section
    let stepSection = document.createElement("div");
    stepSection.classList.add("steps-section");

    let stepHeader = document.createElement("h3");
    stepHeader.textContent = "Steps";
    stepSection.appendChild(stepHeader);

    let stepList = document.createElement("ul");
    stepList.classList.add("step-list");

    data.steps.forEach((step) => {
        let li = document.createElement("li");
        li.textContent = step;
        stepList.appendChild(li);
    });

    stepSection.appendChild(stepList);
    listContainer.appendChild(stepSection);

    div.appendChild(listContainer);

    let idHeader = document.createElement("h4");
    idHeader.textContent = data.id;
    div.appendChild(idHeader);

    // **UPDATE BUTTON**
    let updateBtn = document.createElement("button");
    updateBtn.textContent = "Update";
    updateBtn.classList.add("update-btn");
    updateBtn.addEventListener("click", () => updateRecipe(data.id));

    // **DELETE BUTTON**
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => deleteRecipe(data.id, div));

    // Append buttons
    div.appendChild(updateBtn);
    div.appendChild(deleteBtn);

    content.appendChild(div);
}

function addStep() {
    let container = document.getElementById("step-ul");
    let li = document.createElement("li");
    let input = document.createElement("input");
    input.type = "text";
    input.name = "steps[]";
    input.placeholder = "Enter a step...";

    li.appendChild(input);
    container.appendChild(li);
}

function addIngredient() {
    let container = document.getElementById("ingredients-ul");
    let li = document.createElement("li");
    let input = document.createElement("input");
    input.type = "text";
    input.name = "ingredients[]";
    input.placeholder = "Enter an ingredient...";

    li.appendChild(input);
    container.appendChild(li);
}

async function deleteRecipe(recipeId, recipeCard) {
    try {
        const response = await fetch(`/api/recipes/${recipeId}`, {
            method: "DELETE"
        });

        if (response.ok) {
            console.log("Recipe deleted successfully");
            recipeCard.remove(); // Remove from UI
        } else {
            console.error("Failed to delete recipe");
        }
    } catch (error) {
        console.error("Error deleting recipe:", error);
    }
}

async function updateRecipe(recipeId) {
    let recipeCard = document.querySelector(`[data-recipe-id='${recipeId}']`);
    let recipeName = prompt("Enter new recipe name:", recipeCard.querySelector("h2").textContent);
    
    if (!recipeName) return; // Exit if user cancels

    // Get updated ingredients
    let ingredientList = Array.from(recipeCard.querySelectorAll(".ingredient-list li")).map(li => li.textContent);
    let newIngredients = prompt("Update ingredients (comma separated):", ingredientList.join(",")).split(",");

    // Get updated steps
    let stepList = Array.from(recipeCard.querySelectorAll(".step-list li")).map(li => li.textContent);
    let newSteps = prompt("Update steps (comma separated):", stepList.join(",")).split(",");

    // Create update payload
    let updatedRecipe = {
        name: recipeName.trim(),
        ingredients: newIngredients.map(i => i.trim()),
        steps: newSteps.map(s => s.trim())
    };

    try {
        const response = await fetch(`/api/recipes/${recipeId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedRecipe)
        });

        if (response.ok) {
            console.log("Recipe updated successfully");
            
            // Update UI
            recipeCard.querySelector("h2").textContent = updatedRecipe.name;

            let ingredientUl = recipeCard.querySelector(".ingredient-list");
            ingredientUl.innerHTML = ""; // Clear old list
            updatedRecipe.ingredients.forEach(ingredient => {
                let li = document.createElement("li");
                li.textContent = ingredient;
                ingredientUl.appendChild(li);
            });

            let stepUl = recipeCard.querySelector(".step-list");
            stepUl.innerHTML = ""; // Clear old list
            updatedRecipe.steps.forEach(step => {
                let li = document.createElement("li");
                li.textContent = step;
                stepUl.appendChild(li);
            });

        } else {
            console.error("Failed to update recipe");
        }
    } catch (error) {
        console.error("Error updating recipe:", error);
    }
}
