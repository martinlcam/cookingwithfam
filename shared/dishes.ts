/**
 * Every plated-dish sprite the game can show on the recipe card and result
 * screen. A recipe's `dish` MUST be one of these ids, so Claude picks the
 * closest look instead of inventing a dish we can't draw.
 *
 * `atlas` says which texture holds the frame: "items" for the generated
 * generic dishes (tools/sprites/gen.py), "food" for the PixelFoodThemedAssets
 * pack (tools/sprites/pack.py). Hand-curated on purpose: not every food-pack
 * frame is a meal (bun halves, a moka pot, a gumball machine).
 */
export interface DishDef {
  id: string;
  atlas: "items" | "food";
  /** Shown to the model so it can match a recipe to a look. */
  hint: string;
}

export const DISHES = [
  // Generic savoury plates. Use these for anything that has no closer match.
  { id: "dish_soup", atlas: "items", hint: "soup, stew, broth, curry, chili, anything in a bowl with liquid" },
  { id: "dish_salad", atlas: "items", hint: "salad, slaw, raw veg bowl" },
  { id: "dish_steak", atlas: "items", hint: "steak, chop, grilled meat or fish fillet on a plate" },
  { id: "dish_stirfry", atlas: "items", hint: "stir fry, fried rice, sautéed mix in a pan" },
  { id: "dish_rice", atlas: "items", hint: "rice bowl, risotto, pilaf, grain bowl" },
  { id: "dish_pasta", atlas: "items", hint: "pasta with sauce, spaghetti, penne, mac and cheese" },
  { id: "dish_eggs", atlas: "items", hint: "omelette, scrambled or fried eggs, frittata" },
  { id: "dish_sandwich", atlas: "items", hint: "sandwich, burger, wrap, toast with toppings" },
  { id: "dish_cake", atlas: "items", hint: "generic cake or baked dessert" },
  { id: "dish_curry", atlas: "items", hint: "curry with rice, stew over rice, saucy meat and rice" },
  { id: "dish_pancakes", atlas: "items", hint: "pancakes, waffles, french toast, crepe stack" },
  { id: "dish_fried_chicken", atlas: "items", hint: "fried chicken, nuggets, croquettes, fritters, katsu" },
  // Specific looks from the food pack.
  { id: "pizza", atlas: "food", hint: "pizza, flatbread with toppings" },
  { id: "lasagna", atlas: "food", hint: "lasagna, baked pasta, casserole, gratin" },
  { id: "ramen_bowl", atlas: "food", hint: "ramen, noodle soup, pho, udon" },
  { id: "taco", atlas: "food", hint: "taco, tortilla, fajita, burrito" },
  { id: "dumplings", atlas: "food", hint: "dumplings, gyoza, potstickers, wontons, bao" },
  { id: "sushi", atlas: "food", hint: "assorted sushi platter" },
  { id: "maki_sushi_roll", atlas: "food", hint: "sushi roll, maki, kimbap" },
  { id: "salmon_nigiri", atlas: "food", hint: "nigiri, sashimi, raw fish on rice" },
  { id: "ebi_nigiri", atlas: "food", hint: "shrimp nigiri, prawn on rice" },
  { id: "gunkan_maki", atlas: "food", hint: "gunkan, rice with roe or topping wrapped in nori" },
  { id: "onigiri", atlas: "food", hint: "onigiri, rice ball, rice triangle" },
  { id: "egg_toast", atlas: "food", hint: "egg on toast, avocado toast, open sandwich" },
  { id: "caprese_crostini", atlas: "food", hint: "bruschetta, crostini, tomato on bread" },
  { id: "khachapuri", atlas: "food", hint: "cheese bread boat, calzone, stuffed bread" },
  { id: "patty", atlas: "food", hint: "burger patty, meatball, cutlet, fritter" },
  { id: "baguette", atlas: "food", hint: "bread loaf, baguette, garlic bread" },
  { id: "croissant", atlas: "food", hint: "croissant, pastry, pain au chocolat" },
  { id: "simit", atlas: "food", hint: "bagel, pretzel, ring bread" },
  { id: "strawberry_sando", atlas: "food", hint: "fruit sandwich, cream sandwich" },
  { id: "cup_cake", atlas: "food", hint: "cupcake, muffin" },
  { id: "chocolate_cake", atlas: "food", hint: "chocolate cake, brownie" },
  { id: "strawberry_cake", atlas: "food", hint: "fruit cake, sponge cake, shortcake" },
  { id: "carrot_cake", atlas: "food", hint: "carrot cake, banana bread, loaf cake" },
  { id: "lemon_cheesecake", atlas: "food", hint: "cheesecake, lemon tart" },
  { id: "raspberry_pie", atlas: "food", hint: "fruit pie, crumble, cobbler" },
  { id: "pumpkin_pie", atlas: "food", hint: "pumpkin pie, custard pie, quiche" },
  { id: "pudding", atlas: "food", hint: "pudding, flan, custard" },
  { id: "panna_cotta", atlas: "food", hint: "panna cotta, mousse, yogurt dessert" },
  { id: "ice_cream", atlas: "food", hint: "ice cream, sorbet, frozen dessert" },
  { id: "glazed_doughnut", atlas: "food", hint: "doughnut, fried dough, churros" },
  { id: "macaron", atlas: "food", hint: "cookies, biscuits, macarons" },
  { id: "swiss_roll", atlas: "food", hint: "roll cake, crepe, pancake stack" },
  { id: "lemonade", atlas: "food", hint: "cold drink, juice, lemonade" },
  { id: "milk_shake", atlas: "food", hint: "smoothie, milkshake" },
  { id: "coffee", atlas: "food", hint: "coffee, hot drink" },
  { id: "tea", atlas: "food", hint: "tea, herbal drink" },
] as const satisfies readonly DishDef[];

export type DishId = (typeof DISHES)[number]["id"];
export const DISH_IDS = DISHES.map((d) => d.id) as [DishId, ...DishId[]];
export const DISH_BY_ID: Record<string, DishDef> = Object.fromEntries(DISHES.map((d) => [d.id, d]));
