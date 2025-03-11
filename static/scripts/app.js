document.addEventListener("DOMContentLoaded", function() {
    formStuff();
});

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
            addRecipeToList(result);

            document.getElementById("recipe-name").value = "";
        } catch(error) {
            document.getElementById("recipe-name").value = "";
            console.error("Error:", error);
        }   
    });
}

function addRecipeToList(recipeJSON) {
    let content = document.getElementById("content");

    data = recipeJSON.data;

    content.innerHTML += data.name + "\n";
    content.innerHTML += data.steps + "\n";
    content.innerHTML += data.ingredients;
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
