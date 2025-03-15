from pydantic import BaseModel

class RecipeModel(BaseModel):
    name: str
    steps: list[str]
    ingredients: list[str]

class Recipe:
    # POST
    def __init__(self, name: str, steps: list[str], ingredients: list[str]):
        self.name = name
        self.steps = steps
        self.ingredients = ingredients
    
    # GET
    def read(self, id):
        return {
            "id": id,
            "name": self.name,
            "steps": self.steps,
            "ingredients": self.ingredients
        }
        
    # PATCH
    def update(self, name=None, steps=None, ingredients=None):
        if name: self.name = name
        if steps: self.steps = steps
        if ingredients: self.ingredients = ingredients
            
        return {
            "status": 200,
            "message": "recipe updated successfully",
            "data": {
                "name": self.name,
                "steps": self.steps,
                "ingredients": self.ingredients
            }
        }
        