import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Recipe } from "./recipe";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Ingredient } from './ingredient';


@Injectable({ providedIn: 'root' })
export class RecipeService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiServerUrl}/recipe/all`)
  }

  public getLastRecipe(): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiServerUrl}/recipe/last`)
  }

  public addRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiServerUrl}/recipe/add`, recipe)
  }
  public updateRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiServerUrl}/recipe/update`, recipe)
  }

  public enrollIngredientToRecipe(recipeId: number, ingredientId: number): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiServerUrl}/recipe/${recipeId}/ingredient/${ingredientId}`, "done");
  }

  public deleteRecipe(recipeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/recipe/delete/${recipeId}`)
  }
}
