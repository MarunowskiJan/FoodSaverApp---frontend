import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Ingredient } from './ingredient';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class IngredientService {
    private apiServerUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) { }

    public getIngredients(): Observable<Ingredient[]> {
        return this.http.get<Ingredient[]>(`${this.apiServerUrl}/ingredient/all`)
    }

    public addIngredient(ingredient: Ingredient): Observable<Ingredient> {
        return this.http.post<Ingredient>(`${this.apiServerUrl}/ingredient/add`, ingredient)
    }
    public updateIngredient(ingredient: Ingredient): Observable<Ingredient> {
        return this.http.put<Ingredient>(`${this.apiServerUrl}/ingredient/update`, ingredient)
    }

    public deleteIngredient(ingredientId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiServerUrl}/ingredient/delete/${ingredientId}`);
    }
}