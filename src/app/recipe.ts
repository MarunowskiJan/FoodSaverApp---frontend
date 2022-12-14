import { Ingredient } from "./ingredient";

export interface Recipe {
    id: number;
    name: string;
    imageUrl: string;
    rate: number;
    serves: number;
    preparation: string;
    enrolledIngredients: Ingredient[];
}