/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { ELmBranch } from "@dflex/dom-gen";

import store from "../DnDStore";
import type { DraggableDnDInterface } from "../Draggable";

import Droppable from "./Droppable";

class EndDroppable extends Droppable {
  private spliceAt: number;

  constructor(draggable: DraggableDnDInterface) {
    super(draggable);
    this.spliceAt = -1;
  }

  /**
   *
   * @param lst -
   * @param i -
   */
  private undoElmTranslate(lst: ELmBranch, i: number) {
    const elmID = lst[i];

    if (elmID) {
      const element = store.getElmById(elmID);

      /**
       * Note: rolling back won't affect order array. It only deals with element
       * itself and totally ignore any instance related to store.
       */
      element.rollYBack(this.draggable.operationID);
      this.draggable.numberOfElementsTransformed -= 1;
    } else {
      this.spliceAt = i;
    }
  }

  private loopAscWithAnimationFrame(from: number, lst: string[]) {
    let i = from;

    const run = () => {
      this.undoElmTranslate(lst, i);
      i += 1;

      if (i < lst.length) {
        requestAnimationFrame(run);
      }
    };

    requestAnimationFrame(run);
  }

  private loopDesWithAnimationFrame(from: number, lst: string[]) {
    let i = from;

    const run = () => {
      this.undoElmTranslate(lst, i);
      i -= 1;

      if (i >= 0) {
        requestAnimationFrame(run);
      }
    };

    requestAnimationFrame(run);
  }

  /**
   * Undo list elements order and instances including translateX/Y and indexes
   * locally.
   */
  private undoList(lst: string[]) {
    const {
      order: { self: from },
      id: draggedID,
    } = this.draggable.draggedElm;

    if (this.isListLocked || this.draggable.isMovingDown) {
      this.loopAscWithAnimationFrame(from, lst);
    } else {
      /**
       * If from is zero, means dragged left, and all siblings are lifted up.
       */
      const actualFrom = from === 0 ? lst.length - 1 : from;
      this.loopDesWithAnimationFrame(actualFrom, lst);
    }

    lst.splice(this.spliceAt, 1);
    lst.splice(from, 0, draggedID);
  }

  private verify(lst: string[]) {
    const siblingsBoundaries =
      store.siblingsBoundaries[
        store.registry[this.draggable.draggedElm.id].keys.sK
      ];

    const id = lst[0];

    if (id.length === 0 || this.draggable.draggedElm.id === id) {
      return (
        Math.floor(siblingsBoundaries.top) ===
        Math.floor(this.draggable.occupiedOffset.currentTop)
      );
    }

    const element = store.getElmById(id);

    return (
      Math.floor(siblingsBoundaries.top) === Math.floor(element.currentTop)
    );
  }

  endDragging() {
    const siblings = store.getElmSiblingsById(this.draggable.draggedElm.id);

    let isFallback = false;

    if (Array.isArray(siblings)) {
      if (this.draggable.isNotSettled() || !this.verify(siblings)) {
        isFallback = true;

        this.undoList(siblings);
      }
    }

    this.draggable.endDragging(isFallback);
  }
}

export default EndDroppable;
