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
  starWidth: number = 0;
  isRecipe: boolean = true;
  public recipesDetails: Recipe[] = [];
  public recipes: Recipe[] = [];
  public ingredients: Ingredient[] = [];
  public addedIngredients: Ingredient[] = [];
  public fridgeIngredients: Ingredient[] = [];
  public lastRecipe: Recipe | undefined;
  public editRecipe: Recipe | undefined;
  public deleteRecipe: Recipe | undefined;
  public editIngredient: Ingredient | undefined;
  public deleteIngredient: Ingredient | undefined;
  public dictionaryMap = new Map<Recipe, number>();


  constructor(private recipeService: RecipeService, private ingredientService: IngredientService) { }

  ngOnInit(): void {
    this.getRecipes();
    this.getIngredients();
  }

  public getColor(balance: number): string {
    if (balance > 75) {
      return "green";
    }
    else if (balance < 25) {
      return "red";
    }
    else return "orange";
  }

  rateProduct(rateValue: number) {
    this.starWidth = rateValue * 75 / 5;
  }

  public addIngredientToExistingRecipe(recipeId: number, ingredientId: number): void {
    this.recipeService.enrollIngredientToRecipe(recipeId, ingredientId).subscribe({
      next: (response: Recipe) => {
        console.log(response);
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
        for (const ingredient of this.addedIngredients) {
          this.addIngredientToExistingRecipe(response.id, ingredient.id)
        }
        this.getRecipes();
        addRecipeForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
        addRecipeForm.reset();
      }
    });
    this.getRecipes();
  }

  public isIngredientInRecipe(fridgeIngredient: Ingredient, recipe: Recipe): boolean {
    for (const ingredient of recipe.enrolledIngredients)
      if (ingredient.name.toLowerCase().indexOf(fridgeIngredient.name.toLowerCase()) !== -1) {
        return true;
      }
    return false;
  }

  public countTheCompatibility(fridge: Ingredient[], recipe: Recipe): number {
    var counter: number = 0;
    const lengthOfArray = recipe.enrolledIngredients.length;
    for (const ingredient of fridge) {
      if (this.isIngredientInRecipe(ingredient, recipe) === true) {
        counter++;
      }
    }
    var result = (counter / lengthOfArray) * 100;
    return result;
  }

  public clearIngredientsList() {
    const dictionaryMap = new Map<Recipe, number>();
    const results: Ingredient[] = [];
    this.fridgeIngredients = results;
    this.dictionaryMap = dictionaryMap;
  }

  public suggestRecipe(): void {
    const dictionaryMap = new Map<Recipe, number>();
    for (const recipe of this.recipes) {
      var compatibility = this.countTheCompatibility(this.fridgeIngredients, recipe).toFixed(2);
      dictionaryMap.set(recipe, Number(compatibility))
      console.log(compatibility)
    }
    console.log(dictionaryMap)
    const sortedNumDesc = new Map([...dictionaryMap].sort((a, b) => b[1] - a[1]));
    this.dictionaryMap = sortedNumDesc;
  }

  public addFridgeIngredient(ingredient: Ingredient): void {
    if (this.fridgeIngredients.indexOf(ingredient) > -1) {
      alert("Składnik został już dodany!");
    }
    else {
      this.fridgeIngredients.push(ingredient);
      this.suggestRecipe();
    }
  }

  public addIngredientToNewRecipe(ingredient: Ingredient): void {
    if (this.addedIngredients.indexOf(ingredient) > -1) {
      alert("Składnik został już dodany!");
    }
    else {
      this.addedIngredients.push(ingredient);
    }
  }

  public removeIngredientFromNewRecipe(ingredient: Ingredient): void {
    if (this.addedIngredients.length === 0) {
      alert("Lista składników jest pusta!");
    }
    else {
      this.addedIngredients.forEach((element, index) => {
        if (element == ingredient) {
          this.addedIngredients.splice(index, 1);
          this.suggestRecipe();
        }
        else {
          alert("Nie można usunąć składnika, który nie został dodany do listy!");
        }
      })
    }
  }

  public removeFridgeIngredient(ingredient: Ingredient): void {
    const results: Ingredient[] = [];

    if (this.fridgeIngredients.length === 0) {
      alert("Lista składników jest pusta!");
    } else {
      this.fridgeIngredients.forEach((element, index) => {
        if (element == ingredient) {
          this.fridgeIngredients.splice(index, 1);
          this.suggestRecipe();
        }
        else {
          alert("Nie można usunąć składnika, który nie został dodany do listy!");
        }
      })
    }
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

  public getLastRecipe(): void {
    this.recipeService.getLastRecipe().subscribe({
      next: (response: Recipe) => {
        this.lastRecipe = response;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    })
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

  public searchIngredientsFridge(ingredientFridgeKey: string): void {
    const ingredientFridgeResults: Ingredient[] = [];
    for (const ingredient of this.ingredients) {
      if (ingredient.name.toLowerCase().indexOf(ingredientFridgeKey.toLowerCase()) !== -1) {
        ingredientFridgeResults.push(ingredient);
      }
    }
    this.ingredients = ingredientFridgeResults;
    if (ingredientFridgeResults.length === 0 || !ingredientFridgeKey) {
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

  public onOpenModalRecipeDetails(mode: string, recipe: Recipe): void {
    const results: Recipe[] = [];
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'showDetails') {
      button.setAttribute('data-target', '#recipeDetailsModal');
      results.push(recipe);
    }
    container!.appendChild(button);
    button.click();
    this.recipesDetails = results;
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

  public onOpenModalFridge(mode: string, ingredient?: Ingredient, recipe?: Recipe): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'fridge') {
      button.setAttribute('data-target', '#fridgeModal');
    }
    container!.appendChild(button);
    button.click();
  }

  public changeShowList(mode: string): boolean {
    if (mode === "recipesList") {
      return this.isRecipe = true;
    }
    return this.isRecipe = false;
  }
}
