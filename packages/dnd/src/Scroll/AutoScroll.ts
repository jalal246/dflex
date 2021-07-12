/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable class-methods-use-this */

import type { CoreInstanceInterface } from "@dflex/core-instance";
import type { ScrollOpt } from "./types";

class AutoScroll {
  parent: CoreInstanceInterface;

  opts: ScrollOpt;

  constructor(parent: CoreInstanceInterface, opts: ScrollOpt) {
    this.parent = parent;
    this.opts = opts;
  }

  isParenOverflowX() {
    const parentBottom = this.parent.offset.top + this.parent.offset.height;

    const elemOverflowX = parentBottom > window.innerHeight;

    if (elemOverflowX) return true;

    return this.parent.offset.top < 0;
  }

  isParentTheDocument() {
    return (
      this.parent.ref === document.body ||
      this.parent.ref === document.documentElement
    );
  }

  scroll(clientX: number, clientY: number) {
    const isParentHasScroll =
      !this.isParentTheDocument() && !this.isParenOverflowX();

    if (isParentHasScroll) {
      const { top, left, height, width } = this.parent.offset;

      if (top + height - clientY < this.opts.threshold) {
        this.parent.ref.scrollTop += this.opts.speed;
      } else if (clientY - top < this.opts.threshold) {
        this.parent.ref.scrollTop -= this.opts.speed;
      }

      if (left + width - clientX < this.opts.threshold) {
        this.parent.ref.scrollLeft += this.opts.speed;
      } else if (clientX - left < this.opts.threshold) {
        this.parent.ref.scrollLeft -= this.opts.speed;
      }

      return;
    }

    const documentScrollingElement =
      document.scrollingElement || document.documentElement;

    const { innerHeight, innerWidth } = window;

    if (clientY < this.opts.threshold) {
      documentScrollingElement.scrollTop -= this.opts.speed;
    } else if (innerHeight - clientY < this.opts.threshold) {
      window.scroll(0, documentScrollingElement.scrollTop + this.opts.speed);

      // documentScrollingElement.scrollTop += this.opts.speed;
      // drag(clientX, clientY - this.opts.speed);
      console.log("?>>", this.opts.speed);
    }

    if (clientX < this.opts.threshold) {
      documentScrollingElement.scrollLeft -= this.opts.speed;
    } else if (innerWidth - clientX < this.opts.threshold) {
      documentScrollingElement.scrollLeft += this.opts.speed;
    }
  }
}

export default AutoScroll;
