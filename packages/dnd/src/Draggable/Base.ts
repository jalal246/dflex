/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { AbstractDraggable } from "@dflex/draggable";

import { CoreInstanceInterface } from "@dflex/core-instance";

import type { MouseCoordinates } from "@dflex/draggable";
import type { ELmBranch } from "@dflex/dom-gen";

import store from "../DnDStore";

import type { ElmTree } from "../DnDStore";

import type {
  DraggableBaseInterface,
  ThresholdPercentages,
  LayoutThresholds,
} from "./types";
import { FinalDndOpts } from "../types";

/**
 * Base element.
 *
 * Creates draggedElm and activeParent and initializes thresholds.
 */
class Base
  extends AbstractDraggable<CoreInstanceInterface>
  implements DraggableBaseInterface
{
  tempIndex: number | null;

  operationID: string;

  opts: FinalDndOpts;

  parentsList: ELmBranch;

  siblingsList: string[] | null;

  activeParent!: CoreInstanceInterface | null;

  isOutActiveParent!: boolean;

  setOfTransformedIds!: Set<string>;

  thresholds: LayoutThresholds;

  thresholdsPercentages: ThresholdPercentages;

  constructor(
    elmTree: ElmTree,
    initCoordinates: MouseCoordinates,
    opts: FinalDndOpts
  ) {
    const {
      element,
      parent,
      branches: { siblings, parents },
    } = elmTree;

    super(element, initCoordinates);

    const { order } = element;

    this.opts = opts;

    /**
     * Initialize temp index that refers to element new position after
     * transformation happened.
     */
    this.tempIndex = order.self;

    this.parentsList = parents;

    /**
     * Thresholds store, contains max value for each parent and for dragged. Depending on
     * ids as keys.
     */
    this.thresholds = {
      siblings: {},
      dragged: {
        maxBottom: 0,
        maxTop: 0,
        maxLeft: 0,
        maxRight: 0,
      },
    };

    this.thresholdsPercentages = {
      vertical: Math.round(
        (this.opts.thresholds.vertical * this.draggedElm.offset.height) / 100
      ),
      horizontal: Math.round(
        (this.opts.thresholds.horizontal * this.draggedElm.offset.width) / 100
      ),
    };

    /**
     * Init max direction for position
     */
    this.setThreshold(this.draggedElm.currentTop, this.draggedElm.currentLeft);

    const siblingsBoundaries =
      store.siblingsBoundaries[store.registry[this.draggedElm.id].keys.sK];

    this.setThreshold(
      siblingsBoundaries.top,
      siblingsBoundaries.maxLeft,
      siblingsBoundaries.bottom,
      store.registry[this.draggedElm.id].keys.sK
    );

    this.siblingsList = Array.isArray(siblings) ? siblings : null;

    this.setIsOrphan(parent);

    this.operationID = store.tracker.newTravel();
  }

  /**
   * Check if dragged has no parent and then set the related operations
   * accordingly.
   *
   * @param parent -
   */
  private setIsOrphan(parent: CoreInstanceInterface | null) {
    /**
     * Not all elements have parents.
     */
    if (parent) {
      /**
       * Indicator to parents that have changed. This facilitates looping in
       * affected parents only.
       */
      this.setOfTransformedIds = new Set([]);
      this.assignActiveParent(parent);

      this.isOutActiveParent = false;
    } else {
      /**
       * Dragged has no parent.
       */
      this.activeParent = null;
    }
  }

  /**
   * Sets thresholds for dragged element position depending on its
   * position inside parent which is related to droppable left and top.
   *
   * @param top -
   * @param left -
   * @param height -
   * @param siblingsK -
   */
  setThreshold(top: number, left: number, height?: number, siblingsK?: string) {
    const { vertical, horizontal } = this.thresholdsPercentages;

    let $;

    if (siblingsK && height) {
      if (!this.thresholds.siblings[siblingsK]) {
        this.thresholds.siblings[siblingsK] = {
          maxBottom: 0,
          maxTop: 0,
          maxLeft: 0,
          maxRight: 0,
        };
      }

      $ = this.thresholds.siblings[siblingsK];

      $.maxBottom = height - vertical;
    } else {
      $ = this.thresholds.dragged;

      /**
       * When going down, currentTop increases (+vertical) with droppable
       * taking into considerations (+ vertical).
       */
      $.maxBottom = top + vertical;
    }

    /**
     * Calculate max-vertical for up and down:
     */

    /**
     * When going up, currentTop decreases (-vertical).
     */
    $.maxTop = top - vertical;

    /**
     * When going left, currentLeft decreases (-horizontal).
     */
    $.maxLeft = left - horizontal;

    /**
     * When going right, currentLeft increases (+horizontal) with droppable
     * taking into considerations (+ horizontal).
     */
    $.maxRight = left + horizontal;
  }

  isParenOverflowX() {
    const parentBottom =
      this.activeParent!.offset.top + this.activeParent!.offset.height;

    const elemOverflowX = parentBottom > window.innerHeight;

    return elemOverflowX;
  }

  /**
   * Assigns new ACTIVE_PARENT: parent who contains dragged
   *
   * @param element -
   */
  private assignActiveParent(element: CoreInstanceInterface) {
    /**
     * Assign instance ACTIVE_PARENT which represents droppable. Then
     * assign owner parent so we have from/to.
     */
    this.activeParent = element;

    /**
     * Add flag for undo method so we can check which  parent is being
     * transformed and which is not.
     */
    this.isOutActiveParent = false;

    if (this.opts.scroll.enable) {
      this.opts.scroll.enable = this.opts.scroll.enable
        ? this.isParenOverflowX()
        : false;
    }
  }
}

export default Base;
