import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Recipe } from './recipe';
import { RecipeService } from './recipe.service';
import { IngredientService } from './ingredient.service';
import { Ingredient } from './ingredient';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public recipes: Recipe[] = [];
  public ingredients: Ingredient[] = [];
  public editRecipe: Recipe | undefined;
  public deleteRecipe: Recipe | undefined;
  public editIngredient: Ingredient | undefined;
  public deleteIngredient: Ingredient | undefined;

  constructor(private recipeService: RecipeService, private ingredientService: IngredientService) { }

  ngOnInit(): void {
    this.getRecipes();
    this.getIngredients();
  }

  public getRecipes(): void {
    this.recipeService.getRecipes().subscribe({
      next: (response: Recipe[]) => {
        this.recipes = response;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public getIngredients(): void {
    this.ingredientService.getIngredients().subscribe({
      next: (response: Ingredient[]) => {
        this.ingredients = response;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onAddRecipe(addRecipeForm: NgForm): void {
    document.getElementById('add-recipe-form')!.click();
    this.recipeService.addRecipe(addRecipeForm.value).subscribe({
      next: (response: Recipe) => {
        console.log(response);
        this.getRecipes();
        addRecipeForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
        addRecipeForm.reset();
      }
    });
  }

  public onAddIngredient(addIngredientForm: NgForm): void {
    document.getElementById('add-ingredient-form')!.click();
    this.ingredientService.addIngredient(addIngredientForm.value).subscribe({
      next: (response: Ingredient) => {
        console.log(response);
        this.getIngredients();
        addIngredientForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
        addIngredientForm.reset();
      }
    });
  }

  public onUpdateRecipe(recipe: Recipe): void {
    this.recipeService.updateRecipe(recipe).subscribe({
      next: (response: Recipe) => {
        console.log(response);
        this.getRecipes();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onUpdateIngredient(ingredient: Ingredient): void {
    this.ingredientService.updateIngredient(ingredient).subscribe({
      next: (response: Ingredient) => {
        console.log(response);
        this.getIngredients();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onDeleteRecipe(recipeId: number): void {
    this.recipeService.deleteRecipe(recipeId).subscribe({
      next: (response: void) => {
        console.log(response);
        this.getRecipes();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onDeleteIngredient(ingredientId: number): void {
    this.ingredientService.deleteIngredient(ingredientId).subscribe({
      next: (response: void) => {
        console.log(response);
        this.getIngredients();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public searchRecipes(recipeKey: string): void {
    const results: Recipe[] = [];
    for (const recipe of this.recipes) {
      if (recipe.name.toLowerCase().indexOf(recipeKey.toLowerCase()) !== -1) {
        results.push(recipe);
      }
    }
    this.recipes = results;
    if (results.length === 0 || !recipeKey) {
      this.getRecipes();
    }
  }

  public searchIngredients(ingredientKey: string): void {
    const ingredientResults: Ingredient[] = [];
    for (const ingredient of this.ingredients) {
      if (ingredient.name.toLowerCase().indexOf(ingredientKey.toLowerCase()) !== -1) {
        ingredientResults.push(ingredient);
      }
    }
    this.ingredients = ingredientResults;
    if (ingredientResults.length === 0 || !ingredientKey) {
      this.getIngredients();
    }
  }

  public onOpenModalRecipe(mode: string, recipe?: Recipe): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'addRecipe') {
      button.setAttribute('data-target', '#addRecipeModal');
    }
    else if (mode === 'editRecipe') {
      this.editRecipe = recipe;
      button.setAttribute('data-target', '#updateRecipeModal');
    }
    else if (mode === 'deleteRecipe') {
      this.deleteRecipe = recipe;
      button.setAttribute('data-target', '#deleteRecipeModal');
    }
    container!.appendChild(button);
    button.click();
  }
  public onOpenModalIngredient(mode: string, ingredient?: Ingredient): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'addIngredient') {
      button.setAttribute('data-target', '#addIngredientModal');
    }
    else if (mode === 'editIngredient') {
      this.editIngredient = ingredient;
      button.setAttribute('data-target', '#updateIngredientModal');
    }
    else if (mode === 'deleteIngredient') {
      this.deleteIngredient = ingredient;
      button.setAttribute('data-target', '#deleteIngredientModal');
    }
    container!.appendChild(button);
    button.click();
  }
}
