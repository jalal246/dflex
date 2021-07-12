/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-param-reassign */

import AbstractCoreInstance from "./AbstractCoreInstance";

import type {
  Keys,
  Order,
  ElmWIthPointer,
  CoreInstanceInterface,
  Offset,
  TransitionHistory,
} from "./types";

/**
 * Why storing index here? when it's already sorted in order?
 *
 * Each element has index elements to element's position in list. It allows us
 * to avoid looping in idsTreeOrder to know each element position.
 *
 * elem-id = id1
 * iDsInOrder[id3, id1, id2]
 * How do we get elem-id from iDsInOrder without loop? We don't want to loop
 * twice once to know the qualified element to transform and the second to
 * figure out element position.
 *
 * So, iDsInOrder[index] is our position in list. And, to update to
 * new position: iDsInOrder[new-index] = elem-id.
 *
 *
 * Why storing prev-index?
 *
 * Currently, there's no undo history. But, still need one-step back. Why?
 * Because if dragged is out and release, it should go back to its
 * prevIndex aka selfIndex before transformation.
 *
 * why Storing parent-index?
 *
 * To connect element with parents by knowing their locations.
 */

class CoreInstance
  extends AbstractCoreInstance
  implements CoreInstanceInterface
{
  offset!: Offset;

  /** Store history of Y-transition according to unique ID. */
  prevTranslateY: TransitionHistory;

  currentTop: number;

  currentLeft: number;

  scrollWidth?: number;

  scrollHeight?: number;

  clientWidth?: number;

  clientHeight?: number;

  order: Order;

  keys: Keys;

  constructor(elementWithPointer: ElmWIthPointer) {
    const { order, keys, ...element } = elementWithPointer;

    super(element);

    this.prevTranslateY = [];

    /**
     * Used for dragged, storing temporary top, left new positions during the transition.
     */
    this.currentTop = 0;
    this.currentLeft = 0;

    if (this.ref) {
      this.initIndicators();
    }

    this.order = order;
    this.keys = keys;

    if (this.keys.chK !== null) this.getScroll();
  }

  /**
   * Initializes the element offset only when it's called. Since it is sorting
   * different numbers related to transformation we don't need to invoke for
   * idle element because it's costly.
   *
   * So, basically any working element in DnD should be initiated first.
   */
  private initIndicators() {
    const { height, width, left, top } = this.ref.getBoundingClientRect();

    /**
     * Element offset stored once without being triggered to re-calculate.
     * Instead, using currentOffset object as indicator to current
     * offset/position. This offset, is the init-offset.
     */
    this.offset = {
      height,
      width,

      left,
      top,
    };

    this.currentTop = top;
    this.currentLeft = left;
  }

  private getScroll() {
    const { scrollWidth, scrollHeight, clientWidth, clientHeight } = this.ref;

    this.scrollWidth = scrollWidth;
    this.clientWidth = clientWidth;
    this.scrollHeight = scrollHeight;
    this.clientHeight = clientHeight;
  }

  getOffset() {
    return {
      height: this.offset.height,
      width: this.offset.width,

      left: this.currentLeft,
      top: this.currentTop,
    };
  }

  private updateCurrentIndicators(topSpace: number, leftSpace: number) {
    this.translateY += topSpace;
    this.translateX += leftSpace;

    const { left, top } = this.offset;

    /**
     * This offset related directly to translate Y and Y. It's isolated from
     * element current offset and effects only top and left.
     */
    this.currentTop = top + this.translateY;
    this.currentLeft = left + this.translateX;
  }

  transformElm() {
    this.ref.style.transform = `translate(${this.translateX}px,${this.translateY}px)`;
  }

  /**
   *  Update element index in order  branch
   *
   * @param i - index
   */
  private updateOrderIndexing(i: number) {
    const { self: oldIndex } = this.order;

    const newIndex = oldIndex + i;

    this.order.self = newIndex;

    return { oldIndex, newIndex };
  }

  assignNewPosition(
    branchIDsOrder: string[],
    newIndex: number,
    oldIndex?: number
  ) {
    // TODO: Add this to confusion mode:newIndex < 0)
    branchIDsOrder[newIndex] = this.id;
    if (oldIndex !== undefined) branchIDsOrder[oldIndex] = "";
  }

  /**
   *  Set a new translate position and store the old one.
   *
   * @param topSpace -
   * @param operationID  - Only if moving to a new position.
   */
  private seTranslate(topSpace: number, operationID?: string) {
    if (operationID) {
      this.prevTranslateY.push({
        ID: operationID,
        translateY: this.translateY,
      });
    }

    this.updateCurrentIndicators(topSpace, 0);
    this.transformElm();
  }

  /**
   * Sets new vertical position. Which includes, TranslateY and OffsetTop. By assigning the
   * new calculated value by +/- new difference.
   *
   * Note: Why we don't need setXPosition?
   * Because, elements always move in the same list container, the only one who's migrated to
   * another is dragged.
   *
   * Note: isShuffle is flag made for updating last element in array
   * which is dragged. Normally, update element position and clear its previous
   * position but when updating last element the array is ready and done we need
   * to update one position only so don't clear previous.
   *
   * @param iDsInOrder -
   * @param sign - (+1/-1)
   * @param topSpace - space between dragged and the immediate next element.
   * @param operationID - A unique ID used to store translate history
   * @param vIncrement - the number of passed elements.
   * @param isShuffle -
   */
  setYPosition(
    iDsInOrder: string[],
    sign: number,
    topSpace: number,
    operationID: string,
    vIncrement = 1,
    isShuffle = true
  ) {
    this.seTranslate(sign * topSpace, operationID);

    const { oldIndex, newIndex } = this.updateOrderIndexing(sign * vIncrement);

    this.assignNewPosition(
      iDsInOrder,
      newIndex,
      isShuffle ? oldIndex : undefined
    );
  }

  /**
   * Roll back element position vertically(y).
   *
   * @param operationID -
   */
  rollYBack(operationID: string) {
    if (
      this.prevTranslateY.length === 0 ||
      this.prevTranslateY[this.prevTranslateY.length - 1].ID !== operationID
    ) {
      return;
    }
    // @ts-ignore
    const { translateY } = this.prevTranslateY.pop();

    const topSpace = translateY - this.translateY;

    const increment = topSpace > 0 ? 1 : -1;

    this.seTranslate(topSpace);
    this.updateOrderIndexing(increment);
  }
}

export default CoreInstance;
