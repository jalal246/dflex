import store from "../DnDStore";

import type { DraggableDnDInterface } from "../Draggable";
/**
 * Class includes all transformation methods related to droppable.
 */
class Droppable {
  protected draggable: DraggableDnDInterface;

  private elmYSpace: number;

  protected draggedYSpace: number;

  private leftDifference: number;

  private effectedElemDirection: 1 | -1;

  protected isListLocked: boolean;

  private isFoundBreakingPoint: boolean;

  private leftAtIndex: number;

  constructor(draggable: DraggableDnDInterface) {
    this.draggable = draggable;

    this.elmYSpace = 0;
    this.draggedYSpace = 0;
    this.leftDifference = 0;

    /**
     * Elements effected by dragged direction.
     */
    this.effectedElemDirection = 1;

    this.isListLocked = false;

    this.leftAtIndex = -1;

    this.isFoundBreakingPoint = false;
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

  // private updateOccupiedOffset(elmTop: number) {
  //   console.log(this.effectedElemDirection);

  //   this.draggable.occupiedTranslate.translateY += 1 * this.draggedYSpace;

  //   this.draggable.occupiedTranslate.translateX += 0;

  //   const { currentTop, currentLeft } = this.draggable.draggedElm;
  //   console.log("file: Droppable.ts ~ line 65 ~ currentTop", currentTop);

  //   /**
  //    * This offset related directly to translate Y and Y. It's isolated from
  //    * element current offset and effects only top and left.
  //    */
  //   this.draggable.occupiedOffset.currentTop = elmTop;
  //   this.draggable.occupiedOffset.currentLeft =
  //     currentLeft + this.draggable.occupiedTranslate.translateX;

  //   console.log("occupiedOffset", this.draggable.occupiedOffset);
  //   console.log(
  //     "file: Droppable.ts ~ line 57 ~ this.draggable.occupiedTranslate.translateY ",
  //     this.draggable.occupiedTranslate.translateY
  //   );
  //   console.log(
  //     "file: Droppable.ts ~ line 61 ~ this.draggedYSpace",
  //     this.draggedYSpace
  //   );
  // }

  /**
   * Updates element instance and calculates the required transform distance. It
   * invokes for each eligible element in the parent container.
   *
   * @param id -
   */
  updateElement(id: string) {
    const element = store.getElmById(id);

    /**
     * breakingPoint detects the first element that comes immediately
     * after dragged. Not in original order, but according to isQualified result.
     *
     * The problem:
     *
     * Supposed we moved elem1 to the last. And we have in order,
     * elm2/elm3/elm4/elm1.
     * Now, we pulled elem2 out of the parent and isQualified is triggered at
     * elm3. That's mean, escaping elm1 from the loop because it's not
     * isQualified. So, all elements will be lifted up except elm1.
     */
    if (!this.isFoundBreakingPoint) {
      const { currentLeft: elmLeft, currentTop: elmTop } = element;

      const {
        draggedElm: { currentLeft: draggedLeft, currentTop: draggedTop },
      } = this.draggable;

      /**
       * Sets the transform value by calculating offset difference from
       * the first braking point between element and dragged. It's done once
       * and for all.
       *
       * This value represents the amount of pixels the element will move
       * up or down.
       *
       * This step here do the trick: By measuring the space toY
       * the next element margin will be included.
       */
      this.draggedYSpace = Math.abs(elmTop - draggedTop);
      this.elmYSpace = this.draggedYSpace;

      this.leftDifference = Math.abs(elmLeft - draggedLeft);

      this.isFoundBreakingPoint = true;
    }

    this.draggable.incNumOfElementsTransformed(this.effectedElemDirection);

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

    /**
     * Start transforming process
     */
    element.setYPosition(
      // @ts-expect-error
      this.draggable.siblingsList,
      this.effectedElemDirection,
      this.elmYSpace,
      this.draggable.operationID,
      1,
      true
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
            element.currentTop,
            element.currentLeft,
            element.offset.height
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

      this.updateElement(id);
    }
  }

  /**
   *
   * @param i - index
   */
  private movePositionIfEligibleID(i: number) {
    const id = this.draggable.siblingsList![i];

    if (this.isIDEligible2Move(id)) {
      this.updateElement(id);
    }
  }

  private liftUp() {
    const from = this.draggable.tempIndex + 1;

    this.leftAtIndex = this.draggable.tempIndex;
    this.draggable.tempIndex = -1;

    for (let i = from; i < this.draggable.siblingsList!.length; i += 1) {
      this.movePositionIfEligibleID(i);
    }
  }

  /**
   *
   * @param to - index
   */
  private moveDown(to: number) {
    for (let i = this.draggable.siblingsList!.length - 1; i >= to; i -= 1) {
      this.movePositionIfEligibleID(i);
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
