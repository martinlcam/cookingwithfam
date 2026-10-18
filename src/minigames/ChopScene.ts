import { SwipeGame } from "./inputs/SwipeGame";

/**
 * chop (swipe): vertical strokes across the item, up or down, each one really cutting the
 * sprite into pieces. The mechanic lives in SwipeGame (Cuttable effect); this scene only
 * picks the tool and the surface.
 */
export class ChopScene extends SwipeGame {
  constructor() {
    super("mg:chop", { tool: "knife", dir: "down", surface: "cutting_board", effect: "cut" });
  }
}
