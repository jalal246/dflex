/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ThresholdPercentages, Restrictions } from "./Draggable";
import type { ScrollOpt } from "./Scroll/types";

export interface Scroll extends ScrollOpt {
  enable: boolean;
}

export interface FinalDndOpts {
  thresholds: ThresholdPercentages;
  restrictions: Restrictions;
  scroll: Scroll;
}

export interface DndOpts {
  thresholds?: Partial<ThresholdPercentages>;
  restrictions?: Partial<Restrictions>;
  scroll?: Partial<Scroll>;
}
