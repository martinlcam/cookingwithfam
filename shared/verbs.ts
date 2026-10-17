/**
 * The full Cooking Mama minigame library. Every recipe step the model
 * generates must use one of these verbs. The client maps each verb to a
 * Phaser scene; unimplemented verbs fall back to a placeholder scene so
 * any recipe is playable from day one.
 */
export type InputType =
  | "swipe"
  | "circular"
  | "tap"
  | "hold"
  | "tilt"
  | "rapid"
  | "place";

export interface VerbDef {
  /** What the model writes in a recipe step. */
  verb: string;
  input: InputType;
  /** Shown to the model so it picks sensibly. */
  hint: string;
  /** Default params the scene reads. The model may override within reason. */
  params: Record<string, number>;
}

export const VERBS = [
  // swipe / slash
  { verb: "chop", input: "swipe", hint: "cut an item into pieces with vertical swipes", params: { count: 6 } },
  { verb: "slice", input: "swipe", hint: "angled slices", params: { count: 5 } },
  { verb: "mince", input: "swipe", hint: "rapid short cuts", params: { count: 12 } },
  { verb: "peel", input: "swipe", hint: "long drags to peel skin", params: { count: 4 } },
  { verb: "shred", input: "swipe", hint: "drag across a grater", params: { count: 8 } },
  { verb: "scale_fish", input: "swipe", hint: "drag against the grain of a fish", params: { count: 8 } },
  { verb: "scissor_cut", input: "swipe", hint: "cut with scissors", params: { count: 4 } },
  { verb: "debone", input: "swipe", hint: "trace along a bone", params: { count: 2 } },
  { verb: "devein", input: "swipe", hint: "short precise drag on shrimp", params: { count: 3 } },
  // circular drag
  { verb: "stir", input: "circular", hint: "stir in a bowl or pot", params: { rotations: 6 } },
  { verb: "mix", input: "circular", hint: "mix with direction changes", params: { rotations: 8 } },
  { verb: "knead", input: "circular", hint: "press and fold dough", params: { rotations: 6 } },
  { verb: "whisk", input: "circular", hint: "fast tight circles", params: { rotations: 12 } },
  { verb: "grate", input: "circular", hint: "up and down on a grater", params: { rotations: 8 } },
  { verb: "grind", input: "circular", hint: "grind with pressure", params: { rotations: 6 } },
  { verb: "mash", input: "circular", hint: "mash repeatedly", params: { rotations: 6 } },
  { verb: "roll_dough", input: "circular", hint: "roll dough flat", params: { rotations: 5 } },
  { verb: "roll_sushi", input: "circular", hint: "one smooth roll", params: { rotations: 1 } },
  // tap timing
  { verb: "flip", input: "tap", hint: "flip when the meter hits the sweet spot", params: { count: 2 } },
  { verb: "fry_flip", input: "tap", hint: "fry, then flip at the right moment", params: { count: 2, seconds: 6 } },
  { verb: "crack_egg", input: "tap", hint: "tap to crack, drag apart", params: { count: 2 } },
  { verb: "pierce", input: "tap", hint: "tap targets", params: { count: 6 } },
  { verb: "skewer", input: "tap", hint: "tap items in order", params: { count: 5 } },
  { verb: "sprinkle", input: "tap", hint: "tap over the dish", params: { count: 8 } },
  { verb: "season", input: "tap", hint: "shake seasoning", params: { count: 6 } },
  // hold and release
  { verb: "pour", input: "hold", hint: "hold to pour, release at the line", params: { target: 0.7 } },
  { verb: "squeeze", input: "hold", hint: "squeeze a lemon or tube", params: { target: 0.6 } },
  { verb: "simmer", input: "hold", hint: "wait and lift the lid in time", params: { seconds: 8 } },
  { verb: "boil", input: "hold", hint: "hold the heat, release before overflow", params: { seconds: 6 } },
  { verb: "deep_fry", input: "hold", hint: "hold until golden", params: { seconds: 7 } },
  // tilt / shake
  { verb: "toss", input: "tilt", hint: "stir fry toss", params: { count: 5 } },
  { verb: "tip_pan", input: "tilt", hint: "tilt the pan", params: { count: 2 } },
  { verb: "strain", input: "tilt", hint: "shake to strain", params: { count: 4 } },
  // blow / rapid tap
  { verb: "blow", input: "rapid", hint: "cool hot food", params: { count: 15 } },
  { verb: "cool", input: "rapid", hint: "fan to cool", params: { count: 12 } },
  { verb: "fan_grill", input: "rapid", hint: "fan the grill", params: { count: 15 } },
  // shape and place
  { verb: "form_ball", input: "place", hint: "shape rice balls or meatballs", params: { count: 3 } },
  { verb: "wrap", input: "place", hint: "fold dumplings", params: { count: 4 } },
  { verb: "stuff", input: "place", hint: "drag filling into a shell", params: { count: 4 } },
  { verb: "spread", input: "place", hint: "spread butter or sauce", params: { count: 1 } },
  { verb: "plate", input: "place", hint: "arrange items on a plate", params: { count: 4 } },
  { verb: "microwave", input: "place", hint: "set the time and stop it", params: { seconds: 5 } },
  { verb: "bake", input: "place", hint: "bake or broil, pull at the right moment", params: { seconds: 8 } },
] as const satisfies readonly VerbDef[];

export type Verb = (typeof VERBS)[number]["verb"];
export const VERB_NAMES = VERBS.map((v) => v.verb) as [Verb, ...Verb[]];
export const VERB_BY_NAME: Record<string, VerbDef> = Object.fromEntries(VERBS.map((v) => [v.verb, v]));
