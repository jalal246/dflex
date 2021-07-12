/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { CoreInstanceInterface } from "@dflex/core-instance";

import store from "../DnDStore";

import type { TempOffset, DraggableDnDInterface } from "../Draggable";

/**
 * Class includes all transformation methods related to droppable.
 */
class Droppable {
  protected draggable: DraggableDnDInterface;

  private elmTransitionY: number;

  private draggedAccumulatedTransitionY: number;

  private draggedYOffset: number;

  private leftDifference: number;

  private effectedElemDirection: 1 | -1;

  protected isListLocked: boolean;

  private leftAtIndex: number;

  private preserveLastElmOffset!: TempOffset;

  private scrollAnimationFrame: number | null;

  constructor(draggable: DraggableDnDInterface) {
    this.draggable = draggable;

    this.elmTransitionY = 0;

    this.draggedAccumulatedTransitionY = 0;
    this.draggedYOffset = 0;

    this.leftDifference = 0;

    /**
     * Elements effected by dragged direction.
     */
    this.effectedElemDirection = 1;

    this.isListLocked = false;

    this.leftAtIndex = -1;

    this.updateLastElmOffset();

    this.scrollAnimationFrame = null;
  }

  /**
   * Gets the temporary index of dragged before it occupies new position.
   */
  getDraggedTempIndex() {
    return this.draggable.tempIndex;
  }

  private setEffectedElemDirection(isUp: boolean) {
    this.effectedElemDirection = isUp ? -1 : 1;
  }

  private updateLastElmOffset() {
    let currentTop = 0;
    let currentLeft = 0;

    if (this.draggable.siblingsList) {
      const lastIndex = this.draggable.siblingsList.length - 1;
      const id = this.draggable.siblingsList[lastIndex];
      const element = store.getElmById(id);
      ({ currentTop, currentLeft } = element);
    }

    this.preserveLastElmOffset = {
      currentLeft,
      currentTop,
    };
  }

  private updateOccupiedOffset(elmTop: number, elmLeft: number) {
    this.draggable.occupiedOffset.currentTop = elmTop + this.draggedYOffset;
    this.draggable.occupiedOffset.currentLeft = elmLeft;
  }

  private updateOccupiedTranslate(direction: 1 | -1) {
    this.draggable.occupiedTranslate.translateY +=
      direction * this.draggedAccumulatedTransitionY;

    this.draggable.occupiedTranslate.translateX += 0;
  }

  private calculateYDistance(element: CoreInstanceInterface) {
    const {
      currentLeft: elmLeft,
      currentTop: elmTop,
      offset: { height: elmHight },
    } = element;

    const {
      occupiedOffset: { currentLeft: draggedLeft, currentTop: draggedTop },
      draggedElm: {
        offset: { height: draggedHight },
      },
    } = this.draggable;

    this.draggedYOffset = 0;
    this.elmTransitionY = 0;

    this.leftDifference = Math.abs(elmLeft - draggedLeft);

    const topDifference = Math.abs(elmTop - draggedTop);

    this.draggedAccumulatedTransitionY = topDifference;
    this.elmTransitionY = topDifference;

    const heightOffset = Math.abs(draggedHight - elmHight);

    if (heightOffset === 0) return;

    if (draggedHight < elmHight) {
      // console.log("elmHight is bigger");

      if (this.effectedElemDirection === -1) {
        // console.log("elm going up");

        this.draggedAccumulatedTransitionY += heightOffset;
        this.draggedYOffset = heightOffset;
      } else {
        // console.log("elm going down");

        this.elmTransitionY -= heightOffset;
      }

      return;
    }

    // console.log("elmHight is smaller");

    if (this.effectedElemDirection === -1) {
      // console.log("elm going up");

      this.draggedAccumulatedTransitionY -= heightOffset;
      this.draggedYOffset = -heightOffset;
    } else {
      // console.log("elm going down");

      this.elmTransitionY += heightOffset;
    }
  }

  /**
   * Updates element instance and calculates the required transform distance. It
   * invokes for each eligible element in the parent container.
   *
   * @param id -
   */
  updateElement(
    id: string,
    isUpdateDraggedTranslate: boolean,
    draggedDirection?: 1 | -1
  ) {
    const element = store.getElmById(id);

    this.calculateYDistance(element);

    this.draggable.incNumOfElementsTransformed(this.effectedElemDirection);

    // TODO: always true for the first element
    if (!this.isListLocked) {
      /**
       * By updating the dragged translate, we guarantee that dragged
       * transformation will not triggered until dragged is over threshold
       * which will be detected by isDraggedOutPosition.
       *
       * However, this is only effective when dragged is fit in its new
       * translate.
       *
       * And we have new translate only once. The first element matched the
       * condition is the breaking point element.
       */
      this.draggable.setThreshold(
        element.currentTop,
        element.currentLeft,
        element.offset.height
      );
    }

    // element.onDragOver();

    const { currentLeft: elmLeft, currentTop: elmTop } = element;

    this.updateOccupiedOffset(elmTop, elmLeft);

    if (isUpdateDraggedTranslate) {
      this.updateOccupiedTranslate(draggedDirection!);
    }

    /**
     * Start transforming process
     */
    element.setYPosition(
      this.draggable.siblingsList!,
      this.effectedElemDirection,
      this.elmTransitionY,

      this.draggable.operationID
    );

    // element.onDragLeave();
  }

  private isElemAboveDragged(elmCurrentOffsetTop: number) {
    return elmCurrentOffsetTop < this.draggable.tempOffset.currentTop;
  }

  private checkIfDraggedIsLastElm() {
    let isLast = false;

    for (let i = this.draggable.siblingsList!.length - 1; i >= 0; i -= 1) {
      const id = this.draggable.siblingsList![i];

      if (this.isIDEligible2Move(id)) {
        const element = store.getElmById(id);

        const { currentTop } = element;

        const isQualified = this.isElemAboveDragged(currentTop);

        if (isQualified) {
          isLast = true;

          /**
           * Update threshold from here since there's no calling to updateElement.
           */
          this.draggable.setThreshold(
            this.preserveLastElmOffset.currentTop,
            this.preserveLastElmOffset.currentLeft,
            element.offset.height
          );

          this.updateOccupiedOffset(
            this.preserveLastElmOffset.currentTop,
            this.preserveLastElmOffset.currentLeft
          );

          break;
        }

        break;
      }
    }

    return isLast;
  }

  /**
   * Compares the dragged offset with element offset and returns
   * true if element is matched.
   *
   * @param elmCurrentOffsetTop -
   */
  private isElemUnderDragged(elmCurrentOffsetTop: number) {
    /**
     * Element is Switchable when it's under dragged.
     */
    return elmCurrentOffsetTop > this.draggable.tempOffset.currentTop;
  }

  private detectDroppableIndex() {
    let droppableIndex = null;

    for (let i = 0; i < this.draggable.siblingsList!.length; i += 1) {
      const id = this.draggable.siblingsList![i];

      if (this.isIDEligible2Move(id)) {
        const element = store.getElmById(id);

        const { currentTop } = element;

        const isQualified = this.isElemUnderDragged(currentTop);

        if (isQualified) {
          droppableIndex = i;

          break;
        }
      }
    }

    return droppableIndex;
  }

  /**
   *
   * @param id -
   */
  private isIDEligible2Move(id: string) {
    return id && id !== this.draggable.draggedElm.id;
  }

  private switchElement() {
    const elmIndex = this.draggable.tempIndex + -1 * this.effectedElemDirection;
    const id = this.draggable.siblingsList![elmIndex];

    if (this.isIDEligible2Move(id)) {
      this.draggable.tempIndex = elmIndex;

      this.updateElement(id, true, this.effectedElemDirection === -1 ? 1 : -1);
    }
  }

  private liftUp() {
    const from = this.draggable.tempIndex + 1;

    this.leftAtIndex = this.draggable.tempIndex;
    this.draggable.tempIndex = -1;

    for (let i = from; i < this.draggable.siblingsList!.length; i += 1) {
      /**
       * Don't update translate because it's not permanent. Releasing dragged
       * means undoing last position.
       */
      const id = this.draggable.siblingsList![i];

      if (this.isIDEligible2Move(id)) {
        this.updateElement(id, true, 1);
      }
    }
  }

  /**
   *
   * @param to - index
   */
  private moveDown(to: number) {
    for (let i = this.draggable.siblingsList!.length - 1; i >= to; i -= 1) {
      const id = this.draggable.siblingsList![i];

      if (this.isIDEligible2Move(id)) {
        this.updateElement(id, true, -1);
      }
    }
  }

  private draggedOutPosition() {
    if (this.draggable.isLeavingFromTop()) {
      /**
       * If leaving and parent locked, do nothing.
       */

      // move element up
      this.setEffectedElemDirection(true);

      // lock the parent
      this.isListLocked = true;

      this.liftUp();

      return;
    }

    if (this.draggable.isLeavingFromBottom()) {
      this.isListLocked = true;

      return;
    }

    if (!this.isListLocked) {
      /**
       * normal movement inside the parent
       */

      /**
       * Going out from the list: Right/left.
       */
      if (this.draggable.isOutPositionHorizontally) {
        // Is is out parent?

        // move element up
        this.setEffectedElemDirection(true);

        // lock the parent
        this.isListLocked = true;

        this.liftUp();

        return;
      }

      /**
       * Normal state, switch.
       */

      // inside the list, effected should be related to mouse movement
      this.setEffectedElemDirection(this.draggable.isMovingDown);

      this.switchElement();
    }
  }

  private unlockParent() {
    this.isListLocked = false;
  }

  /**
   *
   * @param y -
   */
  private draggedIsComingIn(y: number) {
    /**
     * If tempIndex is zero, the dragged is coming from the top. So, move them
     * down all: to=0
     */
    let to: number | null = 0;
    let hasToMoveSiblingsDown = true;

    /**
     * Otherwise, detect where it coming from and update tempIndex
     * accordingly.
     */
    if (this.draggable.tempIndex !== 0) {
      to = this.detectDroppableIndex();

      if (typeof to !== "number") {
        // check if it's the last element

        if (!this.checkIfDraggedIsLastElm()) return;

        to = this.draggable.siblingsList!.length - 1;

        hasToMoveSiblingsDown = false;
      }

      this.draggable.tempIndex = to;

      /**
       * Last prevY update when leaving the parent container. When we have
       * coming element inside we need new value so we can assign isMoveDown
       * correctly.
       */
      this.draggable.prevY = y;
    }

    this.unlockParent();

    /**
     * Moving element down by setting is up to false
     */
    this.setEffectedElemDirection(false);

    if (hasToMoveSiblingsDown) {
      this.moveDown(to);

      /**
       * Now, resitting direction by figuring out if dragged settled up/dwn.
       */
      const isElmUp = this.leftAtIndex > this.draggable.tempIndex;

      this.setEffectedElemDirection(isElmUp);
    } else {
      this.setEffectedElemDirection(true);
    }

    // @ts-expect-error
    this.draggable.siblingsList[to] = this.draggable.draggedElm.id;

    /**
     * Reset index.
     */
    this.leftAtIndex = -1;
  }

  /**
   * Invokes draggable method responsible of transform.
   * Monitors dragged translate and called related methods. Which controls the
   * active and droppable method.
   *
   * @param x- mouse X coordinate
   * @param y- mouse Y coordinate
   */
  dragAt(x: number, y: number) {
    console.log("file: Droppable.ts ~ line 491 ~ x", y);
    if (
      y >= 460 &&
      this.draggable.scroll &&
      this.scrollAnimationFrame === null
    ) {
      this.scrollAnimationFrame = requestAnimationFrame(() => {
        this.draggable.scroll!.scroll(x, y);
        this.draggable.dragAt(
          x,
          y + (document.scrollingElement || document.documentElement).scrollTop
        );
        this.scrollAnimationFrame = null;
      });
      return;
    }

    this.draggable.dragAt(x, y);

    if (this.draggable.siblingsList === null) return;

    let isOutSiblingsContainer = false;
    const { sK } = store.getElmById(this.draggable.draggedElm.id).keys;

    this.draggable.setDraggedMovingDown(y);

    if (this.draggable.isOutThreshold()) {
      if (!this.isListLocked) {
        this.draggedOutPosition();

        return;
      }

      isOutSiblingsContainer = this.draggable.isOutThreshold(sK);

      // // when it's out, and on of theses is true then it's happening.
      if (!isOutSiblingsContainer) {
        this.draggedIsComingIn(y);

        return;
      }

      return;
    }

    /**
     * When dragged is out parent and returning to it.
     */
    if (this.isListLocked) {
      isOutSiblingsContainer = this.draggable.isOutThreshold(sK);

      if (!isOutSiblingsContainer) {
        this.draggedIsComingIn(y);
      }
    }
  }
}

export default Droppable;
