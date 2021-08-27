import { PoopSample } from "../interfaces/poopSample"
import { Todo } from '../interfaces/todo'

export class Pet {
  id: number = +new Date()
  picture: string
  name: string
  breed: string
  age: string
  gender: string
  weight: number
  weightType: string
  humanTreats: string
  treats: string
  goals: string
  neutered: boolean
  spayed: boolean
  desexedUndecided: boolean
  mealFrequency: number
  onboardingComplete: boolean
  tellUsMoreComplete: boolean
  petProfileComplete: boolean = false
  mealTypePerMeal: Array<{mealNumber: number, foodConsistency: string}> = [];
  conditions: Array<{condition: string}> = [];
  wetFoods: Array<{dryFood: string}> = [];
  dryFoods: Array<{wetFood: string}> = [];
  allergies: Array<{allergy: string}> = [];
  poopData = [];
  todos = [];
  questions: Array<{question: string, completed: boolean, mealTypeQuestion: boolean, chosenMealType: boolean}> = [
    {question: 'desexed', completed: false, mealTypeQuestion: false, chosenMealType: false},
    {question: 'weight', completed: false, mealTypeQuestion: false, chosenMealType: false},
    {question: 'mealTypePerMeal', completed: false, mealTypeQuestion: false, chosenMealType: false},
    {question: 'dryFoods', completed: false, mealTypeQuestion: true, chosenMealType: false},
    {question: 'wetFoods', completed: false, mealTypeQuestion: true, chosenMealType: false},
    {question: 'allergies', completed: false, mealTypeQuestion: false, chosenMealType: false},
    {question: 'conditions', completed: false, mealTypeQuestion: false, chosenMealType: false}
  ];
}
