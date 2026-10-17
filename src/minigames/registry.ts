import type { Verb } from "@shared/verbs";
import { ChopScene } from "./ChopScene";
import { PlaceholderScene } from "./PlaceholderScene";
import { SliceScene } from "./SliceScene";
import { MinceScene } from "./MinceScene";
import { PeelScene } from "./PeelScene";
import { ShredScene } from "./ShredScene";
import { ScaleFishScene } from "./ScaleFishScene";
import { ScissorCutScene } from "./ScissorCutScene";
import { DeboneScene } from "./DeboneScene";
import { DeveinScene } from "./DeveinScene";
import { StirScene } from "./StirScene";
import { MixScene } from "./MixScene";
import { KneadScene } from "./KneadScene";
import { WhiskScene } from "./WhiskScene";
import { GrateScene } from "./GrateScene";
import { GrindScene } from "./GrindScene";
import { MashScene } from "./MashScene";
import { RollDoughScene } from "./RollDoughScene";
import { RollSushiScene } from "./RollSushiScene";
import { FlipScene } from "./FlipScene";
import { FryFlipScene } from "./FryFlipScene";
import { CrackEggScene } from "./CrackEggScene";
import { PierceScene } from "./PierceScene";
import { SkewerScene } from "./SkewerScene";
import { SprinkleScene } from "./SprinkleScene";
import { SeasonScene } from "./SeasonScene";
import { PourScene } from "./PourScene";
import { SqueezeScene } from "./SqueezeScene";
import { SimmerScene } from "./SimmerScene";
import { BoilScene } from "./BoilScene";
import { DeepFryScene } from "./DeepFryScene";
import { TossScene } from "./TossScene";
import { TipPanScene } from "./TipPanScene";
import { StrainScene } from "./StrainScene";
import { BlowScene } from "./BlowScene";
import { CoolScene } from "./CoolScene";
import { FanGrillScene } from "./FanGrillScene";
import { FormBallScene } from "./FormBallScene";
import { WrapScene } from "./WrapScene";
import { StuffScene } from "./StuffScene";
import { SpreadScene } from "./SpreadScene";
import { PlateScene } from "./PlateScene";
import { MicrowaveScene } from "./MicrowaveScene";
import { BakeScene } from "./BakeScene";

/**
 * Verb -> Phaser scene key. Every verb in shared/verbs.ts has a scene, each
 * built on one of the seven input-type bases in ./inputs. The placeholder
 * remains as the fallback for a verb added to the library before its scene.
 */
const MAP: Record<Verb, string> = {
  chop: "mg:chop",
  slice: "mg:slice",
  mince: "mg:mince",
  peel: "mg:peel",
  shred: "mg:shred",
  scale_fish: "mg:scale_fish",
  scissor_cut: "mg:scissor_cut",
  debone: "mg:debone",
  devein: "mg:devein",
  stir: "mg:stir",
  mix: "mg:mix",
  knead: "mg:knead",
  whisk: "mg:whisk",
  grate: "mg:grate",
  grind: "mg:grind",
  mash: "mg:mash",
  roll_dough: "mg:roll_dough",
  roll_sushi: "mg:roll_sushi",
  flip: "mg:flip",
  fry_flip: "mg:fry_flip",
  crack_egg: "mg:crack_egg",
  pierce: "mg:pierce",
  skewer: "mg:skewer",
  sprinkle: "mg:sprinkle",
  season: "mg:season",
  pour: "mg:pour",
  squeeze: "mg:squeeze",
  simmer: "mg:simmer",
  boil: "mg:boil",
  deep_fry: "mg:deep_fry",
  toss: "mg:toss",
  tip_pan: "mg:tip_pan",
  strain: "mg:strain",
  blow: "mg:blow",
  cool: "mg:cool",
  fan_grill: "mg:fan_grill",
  form_ball: "mg:form_ball",
  wrap: "mg:wrap",
  stuff: "mg:stuff",
  spread: "mg:spread",
  plate: "mg:plate",
  microwave: "mg:microwave",
  bake: "mg:bake",
};

export function sceneKeyFor(verb: Verb): string {
  return MAP[verb] ?? "mg:placeholder";
}

export const MINIGAME_SCENES = [ChopScene, PlaceholderScene, SliceScene, MinceScene, PeelScene, ShredScene, ScaleFishScene, ScissorCutScene, DeboneScene, DeveinScene, StirScene, MixScene, KneadScene, WhiskScene, GrateScene, GrindScene, MashScene, RollDoughScene, RollSushiScene, FlipScene, FryFlipScene, CrackEggScene, PierceScene, SkewerScene, SprinkleScene, SeasonScene, PourScene, SqueezeScene, SimmerScene, BoilScene, DeepFryScene, TossScene, TipPanScene, StrainScene, BlowScene, CoolScene, FanGrillScene, FormBallScene, WrapScene, StuffScene, SpreadScene, PlateScene, MicrowaveScene, BakeScene];
