/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Offset } from "@dflex/core-instance";

import canUseDOM from "./canUseDOM";
import getScrollPosition from "./getScrollPosition";

/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const defaultThreshold = {
  x: 0.2,
  y: 0.2,
};

interface VerticalScroll {}
interface HorizontalScroll {}

function getScrollDirectionAndSpeed(
  scrollContainer: Element,
  scrollContainerRect: Offset,
  { top, left, right, bottom }: Offset,
  acceleration = 10,
  thresholdPercentage = defaultThreshold
) {
  const { clientHeight, clientWidth } = scrollContainer;

  const finalScrollContainerRect =
    canUseDOM && scrollContainer
      ? {
          top: 0,
          left: 0,
          right: clientWidth,
          bottom: clientHeight,
          width: clientWidth,
          height: clientHeight,
        }
      : scrollContainerRect;

  const { isTop, isBottom, isLeft, isRight } =
    getScrollPosition(scrollContainer);

  const threshold = {
    height: finalScrollContainerRect.height * thresholdPercentage.y,
    width: finalScrollContainerRect.width * thresholdPercentage.x,
  };

  if (!isTop && top <= finalScrollContainerRect.top + threshold.height) {
    const y =
      acceleration *
      Math.abs(
        (finalScrollContainerRect.top + threshold.height - top) /
          threshold.height
      );

    return {
      isGoingUp: true,
      y,
    };
  }

  if (
    !isBottom &&
    bottom >= finalScrollContainerRect.bottom - threshold.height
  ) {
    const y =
      acceleration *
      Math.abs(
        (finalScrollContainerRect.bottom - threshold.height - bottom) /
          threshold.height
      );

    return {
      isGoingUp: false,
      y,
    };
  }

  if (!isRight && right >= finalScrollContainerRect.right - threshold.width) {
    const x =
      acceleration *
      Math.abs(
        (finalScrollContainerRect.right - threshold.width - right) /
          threshold.width
      );

    return {
      isGoingRight: true,
      x,
    };
  }

  if (!isLeft && left <= finalScrollContainerRect.left + threshold.width) {
    const x =
      acceleration *
      Math.abs(
        (finalScrollContainerRect.left + threshold.width - left) /
          threshold.width
      );

    return {
      isGoingRight: false,
      x,
    };
  }
}

export default getScrollDirectionAndSpeed;
