/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { AbstractCoreInterface } from "@dflex/core-instance";

export interface TempTranslate {
  x: number;
  y: number;
}

type ValueOf<T> = T[keyof T];

export type DraggedStyle = {
  prop: keyof CSSStyleDeclaration;
  dragValue: ValueOf<CSSStyleDeclaration>;
  afterDragValue: ValueOf<CSSStyleDeclaration> | null;
}[];

export interface AbstractDraggableInterface<T extends AbstractCoreInterface> {
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
}

export interface MouseCoordinates {
  x: number;
  y: number;
}
