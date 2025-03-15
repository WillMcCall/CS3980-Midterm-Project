from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import db

app = FastAPI()

# In memory database
# This should preserve the database upon page reload
# This WON'T preserve the database upon SERVER reload
recipes_db: list[db.Recipe] = []
    
        
@app.get("/api/recipes")
def get_recipes():
    responses: list[dict] = []
    for i in range(len(recipes_db)):
        if recipes_db[i] is not None:
            responses.append(recipes_db[i].read(i))
        
    return responses

@app.get("/api/recipes/{recipe_id}")
def get_recipe(recipe_id: int):
    if recipe_id >= len(recipes_db) or recipes_db[recipe_id] == None:
        return {
            "status": 404,
            "message": "recipe not found!"
        }
        
    return {
        "status": 200,
        "message": "recipe found!",
        "data": recipes_db[recipe_id].read(recipe_id)
    }

@app.post("/api/recipes")
def create_recipe(recipe: db.RecipeModel):
    recipes_db.append(db.Recipe(recipe.name, recipe.steps, recipe.ingredients))
    
    return {
        "status": 200,
        "message": "recipe created successfully",
        "data": recipes_db[-1].read(len(recipes_db)-1)
    }
    
@app.patch("/api/recipes/{recipe_id}")
def update_recipe(recipe_id: int, recipe: db.RecipeModel):
    if recipe_id >= len(recipes_db) or recipes_db[recipe_id] == None:
        return {
            "status": 404,
            "message": "recipe not found!"
        }
        
    return recipes_db[recipe_id].update(recipe.name, recipe.steps, recipe.ingredients)
    
@app.delete("/api/recipes/{recipe_id}")
def delete_recipe(recipe_id: int):
    if recipe_id >= len(recipes_db) or recipes_db[recipe_id] == None:
        return {
            "status": 404,
            "message": "recipe not found!"
        }
        
    recipes_db[recipe_id] = None
    
    return {
        "status": 200,
        "message": f"deleted recipe with id {recipe_id}"
    }

app.mount("/", StaticFiles(directory="static", html=True), name="static")
