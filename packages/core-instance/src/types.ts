/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-unused-vars */

export type ELmBranch = string | string[];

/**
 * Element unique keys in DOM tree.
 */
export interface Keys {
  sK: string;
  pK: string;
  chK: string | null;
}

/**
 * Element order in its branch & higher branch
 */
export interface Order {
  self: number;
  parent: number;
}

/**
 * Generated element pointer
 */
export interface Pointer {
  keys: Keys;
  order: Order;
}

export interface ElmInstance {
  id: string;
  depth: number;
  ref: HTMLElement;
}

export interface ElmWIthPointer extends ElmInstance {
  order: Order;
  keys: Keys;
}

export interface AbstractCoreInterface {
  ref: HTMLElement;
  id: string;
  depth: number;
  translateY: number;
  translateX: number;
}

export interface Offset {
  height: number;
  width: number;
  left: number;
  top: number;
}

export type TransitionHistory = {
  ID: string;
  translateY: number;
}[];

export interface CoreInstanceInterface extends AbstractCoreInterface {
  offset: Offset;
  prevTranslateY: TransitionHistory;
  currentTop: number;
  currentLeft: number;
  scrollWidth?: number;
  scrollHeight?: number;
  clientWidth?: number;
  clientHeight?: number;
  order: Order;
  keys: Keys;
  setYPosition(
    iDsInOrder: ELmBranch,
    sign: number,
    topSpace: number,
    operationID: string,
    vIncrement?: number,
    isShuffle?: boolean
  ): void;
  transformElm(): void;
  assignNewPosition(
    branchIDsOrder: string[],
    newIndex: number,
    oldIndex?: number
  ): void;
  getOffset(): Offset;
}
