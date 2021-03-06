/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { AbstractCoreInterface } from "@dflex/core-instance";
import store from "./DraggableStoreImp";
import AbstractDraggable from "./AbstractDraggable";
import type { MouseCoordinates } from "./types";

class Draggable extends AbstractDraggable<AbstractCoreInterface> {
  /**
   * Creates an instance of Draggable.
   * Works Only on dragged element level.
   *
   *
   * @param id - elementId
   * @param clickCoordinates -
   */
  constructor(id: string, clickCoordinates: MouseCoordinates) {
    const element = store.getElmById(id);

    super(element, clickCoordinates);
  }

  /**
   * @param x -
   * @param y -
   */
  protected dragAt(x: number, y: number) {
    this.translate(x, y);

    this.draggedElm.translateX = this.tempTranslate.x;
    this.draggedElm.translateY = this.tempTranslate.y;
  }

  protected endDragging() {
    this.setDragged(false);
  }
}

export default Draggable;
