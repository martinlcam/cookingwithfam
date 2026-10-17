import Phaser from "phaser";
import type { Recipe } from "@shared/schema";
import { DISH_BY_ID } from "@shared/dishes";
import { FOOD_FRAMES, type FoodFrame } from "./food_frames";

const FRAMES = new Set<string>(FOOD_FRAMES);

/** Keyword -> plated dish from the food atlas. First match wins, so specific rules go first. */
const DISH_RULES: [RegExp, FoodFrame][] = [
  [/ramen|noodle|pho|udon|pasta|spaghetti|penne|macaroni|carbonara|bolognese|linguine|fettuccine/, "ramen_bowl"],
  [/salad|slaw|greens|caprese|bruschetta/, "caprese_crostini"],
  [/nigiri|salmon sushi/, "salmon_nigiri"],
  [/shrimp sushi|ebi/, "ebi_nigiri"],
  [/maki|sushi roll/, "maki_sushi_roll"],
  [/gunkan|roe/, "gunkan_maki"],
  [/sushi/, "sushi"],
  [/onigiri|rice ball/, "onigiri"],
  [/dumpling|gyoza|bao|wonton|potsticker/, "dumplings"],
  [/pizza|flatbread/, "pizza"],
  [/lasagn|baked pasta|casserole/, "lasagna"],
  [/khachapuri|cheese bread|cheese boat/, "khachapuri"],
  [/crostini/, "caprese_crostini"],
  [/egg toast|eggs? on toast|toast|omelet|omelette|scramble|frittata|fried egg/, "egg_toast"],
  [/sandwich|blt|club/, "sandwich"],
  [/burger|slider/, "sandwich"],
  [/taco|burrito|quesadilla|wrap/, "taco"],
  [/baguette|french bread/, "baguette"],
  [/croissant|pastry/, "croissant"],
  [/bread|loaf|roll|bun/, "bread"],
  [/cream puff|profiterole|choux/, "cream_puff"],
  [/cupcake|muffin/, "cup_cake"],
  [/carrot cake/, "carrot_cake"],
  [/red velvet/, "red_velvet_cake"],
  [/strawberry (short)?cake/, "strawberry_cake"],
  [/cheesecake/, "strawberry_cheesecake"],
  [/lava cake|fondant/, "lava_cake"],
  [/chocolate cake|brownie/, "chocolate_cake"],
  [/birthday|layer cake|sponge/, "birthday_cake"],
  [/swiss roll|roulade/, "swiss_roll"],
  [/mango/, "mango_cream_roll"],
  [/matcha|green tea/, "matcha_tiramisu"],
  [/tiramisu/, "tiramisu"],
  [/pumpkin pie/, "pumpkin_pie"],
  [/raspberry pie|berry pie/, "raspberry_pie"],
  [/napoleon|mille/, "raspberry_napoleon"],
  [/blueberry|tart/, "blueberry_tart"],
  [/pie/, "pumpkin_pie"],
  [/cake/, "strawberry_cake"],
  [/creme brulee|brûlée/, "creme_brulee"],
  [/panna cotta/, "panna_cotta"],
  [/pudding|custard|flan/, "pudding"],
  [/jelly|jello/, "cherry_jelly"],
  [/mousse/, "chocolate_mousse"],
  [/ice cream sandwich/, "ice_cream_sandwich"],
  [/ice cream|sundae|gelato/, "ice_cream"],
  [/soft serve/, "soft_ice_cream"],
  [/doughnut|donut/, "glazed_doughnut"],
  [/macaron/, "macaron"],
  [/cookie|biscuit/, "sandwich_cookie"],
  [/baklava/, "baklava"],
  [/kunafa|knafeh/, "kunafa"],
  [/brigadeiro|truffle/, "brigadeiro"],
  [/mooncake/, "moon_cake"],
  [/simit|bagel|pretzel/, "simit"],
  [/latte|cappuccino/, "latte"],
  [/coffee|espresso/, "coffee"],
  [/tea/, "tea"],
  [/lemonade|limeade/, "lemonade"],
  [/milkshake|shake|smoothie/, "milk_shake"],
  [/wine|sangria/, "red_wine"],
  [/champagne|prosecco/, "champagne_glass"],
  [/martini|cocktail/, "martini"],
  [/soda|cola/, "soda"],
  [/honey/, "honey"],
  [/pickle/, "pickle_jar"],
];

function norm(s: string) {
  return s.toLowerCase().replace(/[^a-z ]/g, " ").replace(/\s+/g, " ").trim();
}

/** Pick a plated-dish sprite from the recipe name, then the ingredient list. */
export function dishFrame(recipe: Pick<Recipe, "name" | "ingredients">): FoodFrame {
  const name = norm(recipe.name);
  for (const [re, frame] of DISH_RULES) if (re.test(name)) return frame;
  const all = norm(recipe.ingredients.join(" "));
  for (const [re, frame] of DISH_RULES) if (re.test(all)) return frame;
  // Rough fallbacks by main ingredient so savoury recipes don't get a cake.
  if (/egg/.test(all)) return "egg_toast";
  if (/rice/.test(all)) return "onigiri";
  if (/noodle|pasta/.test(all)) return "ramen_bowl";
  if (/cheese|tomato/.test(all)) return "pizza";
  return "sandwich";
}

/** True if a food-atlas frame of that name exists. */
export function hasFood(frame: string): frame is FoodFrame {
  return FRAMES.has(frame);
}

/**
 * The plated-dish sprite for a recipe. Uses the model's chosen `dish` id from the fixed
 * vocabulary in shared/dishes.ts (generic plates live in the items atlases, specific looks
 * in the food pack). Falls back to keyword matching when `dish` is missing or unknown.
 * `scale` is the on-screen multiple of a 32px frame; generic dishes use the 64px atlas.
 */
export function dishSprite(scene: Phaser.Scene, x: number, y: number, recipe: Pick<Recipe, "name" | "ingredients"> & { dish?: string }, scale = 2) {
  const def = recipe.dish ? DISH_BY_ID[recipe.dish] : undefined;
  if (def?.atlas === "items" && scene.textures.get("items64").has(def.id)) return scene.add.image(x, y, "items64", def.id).setScale(scale / 2);
  if (def?.atlas === "food" && scene.textures.get("food").has(def.id)) return scene.add.image(x, y, "food", def.id).setScale(scale);
  return scene.add.image(x, y, "food", dishFrame(recipe)).setScale(scale);
}
