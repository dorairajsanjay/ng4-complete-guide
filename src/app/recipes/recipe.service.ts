import { Recipe } from './recipe.model';
import {  Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {

    recipesChanged = new Subject();

    //private recipeUrl1 = 'https://www.saltandlavender.com/wp-content/uploads/2018/12/creamy-garlic-chicken-recipe-3-720x1080.jpg';
    //private recipeUrl2 = 'https://www.saltandlavender.com/wp-content/uploads/2015/12/easy-chicken-marsala-recipe-2-720x1080.jpg';

    // private recipes: Recipe[] = [
    //   new Recipe(
    //       'Creamy Garlic Chicken Recipe',
    //       'Recipe for CCG',
    //       this.recipeUrl1,
    //       [
    //           new Ingredient('Chicken', 2),
    //           new Ingredient('Potatoes', 10),
    //           new Ingredient('Tomatoes', 4)
    //       ]),
    //   new Recipe(
    //       'Easy Chicken Marsala', 
    //       'Recipe for ECM', 
    //       this.recipeUrl2,
    //       [
    //         new Ingredient('Chicken', 1),
    //         new Ingredient('Potatoes', 5),
    //         new Ingredient('Tomatoes', 2),
    //         new Ingredient('Cheese', 3)
    //     ]),
    // ];
    private recipes: Recipe[] = [];
    recipeSelected: any;

    constructor(private slService: ShoppingListService){
    }

    getRecipes() {
        return this.recipes.slice(); // returns a new array which is an exact copy of the one here
    }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }

    getRecipe(index: number) {
        return this.recipes.slice()[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[])  {
        this.slService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index,1);
        this.recipesChanged.next(this.recipes.slice());
    }
}
