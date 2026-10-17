/** Units that never take an "s" (metric and mass nouns). */
const INVARIANT = new Set(["g", "kg", "ml", "l", "oz", "lb", "lbs", "cup", "tbsp", "tsp", "pcs", "pc", "piece", "pieces"]);

/** Units that are already plural or count nouns the model tends to use. */
const PLURAL: Record<string, string> = {
  bunch: "bunches",
  box: "boxes",
  loaf: "loaves",
  leaf: "leaves",
  head: "heads",
  jar: "jars",
  can: "cans",
  bottle: "bottles",
  bag: "bags",
  pack: "packs",
  packet: "packets",
  carton: "cartons",
  tub: "tubs",
  stick: "sticks",
  clove: "cloves",
  slice: "slices",
  shaker: "shakers",
  cube: "cubes",
  bowl: "bowls",
  block: "blocks",
};

function pluralize(unit: string, qty: number): string {
  const u = unit.toLowerCase().trim();
  if (qty === 1 || INVARIANT.has(u)) return u;
  if (PLURAL[u]) return PLURAL[u]!;
  if (u.endsWith("s")) return u; // already plural
  return `${u}s`;
}

/** Ingredient names that don't change in the plural. */
const MASS = new Set([
  "fish", "rice", "bread", "cheese", "butter", "milk", "flour", "pasta", "water", "oil", "salt", "sugar", "beef", "pork",
  "chicken", "lettuce", "garlic", "corn", "broccoli", "shrimp", "spinach", "tofu", "honey", "ketchup", "yogurt", "cream",
  "bacon", "ham", "tuna", "salmon", "cereal", "kale", "cabbage", "celery", "ginger", "basil", "parsley", "cilantro",
]);

/** "egg" -> "eggs", "tomato" -> "tomatoes", "cherry" -> "cherries"; multi-word names pluralize the last word. */
function pluralName(name: string): string {
  const words = name.trim().split(" ");
  const last = words.pop() ?? "";
  if (MASS.has(last) || MASS.has(name.trim())) return name;
  let out: string;
  if (last.endsWith("s")) out = last; // already plural ("eggs", "tomatoes")
  else if (/[^aeiou]y$/.test(last)) out = `${last.slice(0, -1)}ies`;
  else if (/(o|x|z|ch|sh)$/.test(last)) out = `${last}es`;
  else out = `${last}s`;
  return [...words, out].join(" ");
}

/**
 * "2 bunches basil", "1 bunch basil", "500 g pasta", "3 eggs" (pcs is dropped
 * and the item name is left alone; the model already writes names singular).
 */
export function formatQty(qty: number, unit: string, name: string): string {
  const u = unit.toLowerCase().trim();
  const n = Number.isInteger(qty) ? String(qty) : qty.toFixed(1);
  if (!u || u === "pcs" || u === "pc" || u === "piece" || u === "pieces") return `${n} ${qty === 1 ? name : pluralName(name)}`;
  return `${n} ${pluralize(u, qty)} ${name}`;
}
