import { ITEM_FRAMES, type ItemFrame } from "./frames";

const FRAMES = new Set<string>(ITEM_FRAMES);

/** Loose words the model tends to use, mapped onto a frame we actually have. */
const SYNONYMS: Record<string, ItemFrame> = {
  onions: "onion", "red onion": "onion", shallot: "onion", scallion: "onion", "spring onion": "onion", leek: "onion",
  tomatoes: "tomato", "cherry tomato": "tomato", "tomato paste": "ketchup", "tomato sauce": "ketchup", passata: "ketchup",
  eggs: "egg", carrots: "carrot", potatoes: "potato", "sweet potato": "potato", yam: "potato",
  "garlic clove": "garlic", "bell pepper": "pepper", capsicum: "pepper", paprika: "pepper",
  mushrooms: "mushroom", cheddar: "cheese", mozzarella: "cheese", parmesan: "cheese", feta: "cheese",
  toast: "bread", bun: "bread", baguette: "bread", tortilla: "bread", pita: "bread",
  "white rice": "rice", "brown rice": "rice", quinoa: "rice", couscous: "rice",
  "chicken breast": "chicken", "chicken thigh": "chicken", turkey: "chicken", drumstick: "chicken",
  salmon: "fish", tuna: "fish", cod: "fish", prawn: "shrimp", prawns: "shrimp",
  spinach: "lettuce", kale: "lettuce", cabbage: "lettuce", salad: "lettuce", greens: "lettuce", herbs: "lettuce", basil: "lettuce", parsley: "lettuce", cilantro: "lettuce",
  lime: "lemon", pear: "apple", margarine: "butter", cream: "milk",
  spaghetti: "pasta", penne: "pasta", macaroni: "pasta", ramen: "noodles",
  steak: "beef", "ground beef": "beef", mince: "beef", ham: "pork", lamb: "beef",
  cauliflower: "broccoli", zucchini: "cucumber", courgette: "cucumber", "green bean": "cucumber", peas: "broccoli",
  "chili pepper": "chili", jalapeno: "chili", "hot sauce": "ketchup",
  vinegar: "oil", "olive oil": "oil", "vegetable oil": "oil", "sesame oil": "oil",
  honey: "sugar", "brown sugar": "sugar", syrup: "sugar",
  "black pepper": "salt", seasoning: "salt", spice: "salt", spices: "salt", "chili flakes": "salt", cumin: "salt",
  stock: "water", broth: "water", "chicken stock": "water", juice: "water", wine: "water",
  "bean curd": "tofu", avocados: "avocado", guacamole: "avocado", "bacon strip": "bacon", "bacon strips": "bacon",
  sausages: "sausage", hotdog: "sausage", "hot dog": "sausage", chorizo: "sausage", "green peas": "peas", "frozen peas": "peas", beans: "peas", edamame: "peas",
  aubergine: "eggplant", eggplants: "eggplant", oranges: "orange", tangerine: "orange", mandarin: "orange", clementine: "orange",
  "greek yogurt": "yogurt", yoghurt: "yogurt", "sour cream": "yogurt", "soy": "soy_sauce", "fish sauce": "soy_sauce", "worcestershire": "soy_sauce",
  "ginger root": "ginger", "pork chop": "pork", "pork belly": "pork", "pork loin": "pork", "ground pork": "pork",
  "egg noodles": "noodles", "rice noodles": "noodles", udon: "noodles", soba: "noodles", "instant noodles": "noodles",
  "frying pan": "pan", skillet: "pan", wok: "pan", saucepan: "pot", "cutting board": "cutting_board", board: "cutting_board",
  mug: "cup", glass: "cup", ladle: "spoon", fork: "spoon", "rolling pin": "rolling_pin", oven: "pot", stove: "pan", microwave: "pot",
};

function norm(s: string) {
  return s.toLowerCase().replace(/[^a-z ]/g, " ").replace(/\s+/g, " ").trim();
}

/** Best sprite frame for an ingredient or vessel name the model wrote. Never throws, falls back to "generic". */
export function itemFrame(name: string): ItemFrame {
  const n = norm(name);
  if (FRAMES.has(n)) return n as ItemFrame;
  if (SYNONYMS[n]) return SYNONYMS[n]!;
  const singular = n.replace(/(es|s)$/, "");
  if (FRAMES.has(singular)) return singular as ItemFrame;
  // Try each word, longest first ("fresh cherry tomatoes" -> tomato).
  const words = n.split(" ").toSorted((a, b) => b.length - a.length);
  for (const w of words) {
    if (FRAMES.has(w)) return w as ItemFrame;
    if (SYNONYMS[w]) return SYNONYMS[w]!;
    const ws = w.replace(/(es|s)$/, "");
    if (FRAMES.has(ws)) return ws as ItemFrame;
    if (SYNONYMS[ws]) return SYNONYMS[ws]!;
  }
  for (const key of Object.keys(SYNONYMS)) if (n.includes(key)) return SYNONYMS[key]!;
  return "generic";
}
