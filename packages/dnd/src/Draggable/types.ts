/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { CoreInstanceInterface } from "@dflex/core-instance";
import type { ELmBranch } from "@dflex/dom-gen";
import type { AbstractDraggableInterface } from "@dflex/draggable";
import type { FinalDndOpts } from "../types";

export interface ThresholdPercentages {
  vertical: number;
  horizontal: number;
}

export interface Threshold {
  maxBottom: number;
  maxTop: number;
  maxLeft: number;
  maxRight: number;
}

export interface LayoutThresholds {
  siblings: { [sk: string]: Threshold };
  dragged: Threshold;
}

export interface TempOffset {
  currentLeft: number;
  currentTop: number;
}

export interface TempTranslate {
  translateX: number;
  translateY: number;
}

export interface Restrictions {
  allowLeavingFromTop: boolean;
  allowLeavingFromBottom: boolean;
  allowLeavingFromLeft: boolean;
  allowLeavingFromRight: boolean;
}

export interface DraggableBaseInterface
  extends AbstractDraggableInterface<CoreInstanceInterface> {
  tempIndex: number | null;
  operationID: string;

  opts: FinalDndOpts;

  parentsList: ELmBranch | null;
  siblingsList: string[] | null;
  activeParent: CoreInstanceInterface | null;

  thresholds: LayoutThresholds;

  isOutActiveParent: boolean;
  thresholdsPercentages: ThresholdPercentages;
  setThreshold(
    top: number,
    left: number,
    height?: number,
    siblingsK?: string
  ): void;
}

export interface DraggableDnDInterface extends DraggableBaseInterface {
  // innerOffsetX: number;
  // innerOffsetY: number;
  tempOffset: TempOffset;
  occupiedOffset: TempOffset;
  occupiedTranslate: TempTranslate;
  prevY: number;
  numberOfElementsTransformed: number;
  isMovingDown: boolean;

  isOutPositionHorizontally: boolean;
  isOutSiblingsHorizontally: boolean;
  dragAt(x: number, y: number): void;
  incNumOfElementsTransformed(effectedElemDirection: number): void;
  setDraggedMovingDown(y: number): void;
  isOutThreshold(siblingsK?: string): boolean;
  isLeavingFromTop(): boolean;
  isLeavingFromBottom(): boolean;
  isNotSettled(): boolean;
  // getLastElmIndex(): number;
  // isLastELm(): boolean;
  endDragging(isFallback: boolean): void;
}
