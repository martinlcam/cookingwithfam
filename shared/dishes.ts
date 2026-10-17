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
  // Generic plates and bowls from the CC0 food packs (items atlas). Use these for anything
  // without a closer match below.
  { id: "soup", atlas: "items", hint: "soup, broth, bisque, anything liquid in a bowl" },
  { id: "stew", atlas: "items", hint: "stew, braise, goulash, chunky one-pot" },
  { id: "chili", atlas: "items", hint: "chili, bean stew, dal, thick spiced bowl" },
  { id: "curry", atlas: "items", hint: "curry with rice, saucy meat or veg over rice" },
  { id: "tagine", atlas: "items", hint: "tagine, casserole, baked pot dish" },
  { id: "salad", atlas: "items", hint: "green salad, raw veg bowl" },
  { id: "slaw", atlas: "items", hint: "coleslaw, shredded salad, pickled veg" },
  { id: "salad_potato", atlas: "items", hint: "potato salad, grain or pasta salad, mayo-dressed salad" },
  { id: "steak_cooked", atlas: "items", hint: "steak, chop, grilled or seared meat on a plate" },
  { id: "meat_cooked", atlas: "items", hint: "roast meat, pork, lamb, sliced meat" },
  { id: "fish_cooked", atlas: "items", hint: "cooked fish fillet, grilled, pan-fried or baked fish" },
  { id: "salmon_steak", atlas: "items", hint: "salmon, pink fish steak" },
  { id: "shrimp_fried", atlas: "items", hint: "shrimp or prawn dish, seafood plate" },
  { id: "fish_sticks", atlas: "items", hint: "battered or breaded fish, fish and chips" },
  { id: "rice_fried", atlas: "items", hint: "stir fry, fried rice, wok dish, sautéed mix" },
  { id: "fried_noodles", atlas: "items", hint: "stir-fried noodles, chow mein, pad thai, lo mein" },
  { id: "rice_steamed", atlas: "items", hint: "rice bowl, steamed rice, pilaf, risotto, grain bowl" },
  { id: "rice_ball", atlas: "items", hint: "rice balls, arancini, onigiri-style" },
  { id: "spaghetti", atlas: "items", hint: "pasta with sauce, spaghetti, penne, mac and cheese" },
  { id: "fried_eggs", atlas: "items", hint: "fried eggs, eggs on a plate, breakfast eggs" },
  { id: "omelet", atlas: "items", hint: "omelette, frittata, folded eggs" },
  { id: "scrambled_eggs", atlas: "items", hint: "scrambled eggs, egg scramble, tofu scramble" },
  { id: "eggsalad", atlas: "items", hint: "egg salad, chicken salad, mayo-based cold salad" },
  { id: "fry_up", atlas: "items", hint: "full breakfast plate, bacon and eggs, hash and eggs" },
  { id: "hash", atlas: "items", hint: "hash, skillet potatoes, home fries, roasted veg plate" },
  { id: "meat_gumbo", atlas: "items", hint: "gumbo, jambalaya, meat and rice stew" },
  { id: "sandwich", atlas: "items", hint: "sandwich, sub, wrap, toastie" },
  { id: "burger", atlas: "items", hint: "burger, slider, patty in a bun" },
  { id: "sandwich_grilled_cheese", atlas: "items", hint: "grilled cheese, melt, quesadilla" },
  { id: "chicken_nuggets", atlas: "items", hint: "fried chicken, nuggets, croquettes, fritters, katsu" },
  { id: "roastedchicken", atlas: "items", hint: "roast chicken, whole roasted bird" },
  { id: "chicken_drumstick_cooked", atlas: "items", hint: "cooked drumstick, chicken leg, wings" },
  { id: "pancakes", atlas: "items", hint: "pancakes, flapjacks, hotcakes" },
  { id: "waffles", atlas: "items", hint: "waffles" },
  { id: "crepes", atlas: "items", hint: "crepes, thin pancakes, blintz" },
  { id: "cake_slice_plain", atlas: "items", hint: "generic cake slice, sponge, loaf cake" },
  { id: "pie", atlas: "items", hint: "savoury or sweet pie, pot pie, quiche" },
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
