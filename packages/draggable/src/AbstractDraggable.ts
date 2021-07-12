/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { AbstractCoreInterface } from "@dflex/core-instance";

import type {
  AbstractDraggableInterface,
  DraggedStyle,
  MouseCoordinates,
  TempTranslate,
} from "./types";

const draggedStyleProps: DraggedStyle = [
  {
    prop: "position",
    dragValue: "relative",
    afterDragValue: null,
  },
  {
    prop: "zIndex",
    dragValue: "99",
    afterDragValue: null,
  },
  {
    prop: "userSelect",
    dragValue: "none",
    afterDragValue: null,
  },
];

class AbstractDraggable<T extends AbstractCoreInterface>
  implements AbstractDraggableInterface<T>
{
  draggedElm: T;

  /**
   * When dragging start, element shouldn't jump from its translate. So, we
   * calculate offset that make translate X,Y start from zero:
   *  goToX = x + this.outerOffsetX.
   *  goToY = y + this.outerOffsetY.
   *
   * goToX and goToY both should be zero with first click. Starts with simple
   * equating: initX = X. Taking into considerations translate value.
   *
   */
  outerOffsetX: number;

  outerOffsetY: number;

  tempTranslate: TempTranslate;

  draggedStyle: DraggedStyle;

  /**
   * Creates an instance of AbstractDraggable.
   * Works Only on dragged element level.
   *
   * @param abstractCoreElm -
   * @param initCoordinates -
   */
  constructor(abstractCoreElm: T, { x: initX, y: initY }: MouseCoordinates) {
    /**
     * Assign instance for dragged.
     */

    this.draggedElm = abstractCoreElm;

    const { translateX, translateY } = this.draggedElm;

    this.outerOffsetX = -initX + translateX;
    this.outerOffsetY = -initY + translateY;

    this.tempTranslate = {
      x: 0,
      y: 0,
    };

    this.draggedStyle = draggedStyleProps;

    this.setPosition(initX, initY);
    this.setDragged(true);
  }

  /**
   * Triggers twice. Once when constructor is initiated, the other when drag is
   * ended. It adds/removes style.
   *
   * @param isActive - is dragged operation active or it is ended.
   */
  protected setDragged(isActive: boolean) {
    if (isActive) {
      this.draggedStyle.forEach(({ prop, dragValue }) => {
        // @ts-expect-error
        this.draggedElm.ref.style[prop] = dragValue;
      });
      // this.draggedElm.ref.style.top = `${49.59375}px`;

      return;
    }
    /**
     * Not active: end of dragging.
     */
    this.draggedStyle.forEach(({ prop, afterDragValue }) => {
      // @ts-ignore
      this.draggedElm.ref.style[prop] = afterDragValue;
    });
  }

  protected setPosition(x: number, y: number) {
    // this.draggedElm.ref.style.top = `${49.59375}px`;
    // this.draggedElm.ref.style.left = `${1229}px`;
    this;
  }

  /**
   * Executes dragging by applying transform.
   * Writes to draggedElmCurrentOffset in Transform class.
   * Set values to isDragged flags.
   *
   * @param x - mouse x coordinates
   * @param y - mouse y coordinates
   */
  protected translate(x: number, y: number) {
    /**
     * Calculates translate coordinates.
     *
     * Indicates dragged y-transformation that's will be updated during the
     * dropping process. Updating Y immediately will effect calculations in
     * transform, that's why it is updated when dragging is done.
     */
    this.tempTranslate.x = x + this.outerOffsetX;
    this.tempTranslate.y = y + this.outerOffsetY;

    this.draggedElm.ref.style.transform = `translate(${this.tempTranslate.x}px,${this.tempTranslate.y}px)`;
  }
}

export default AbstractDraggable;
