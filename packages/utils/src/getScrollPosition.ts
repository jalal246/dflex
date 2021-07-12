/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

function getScrollPosition(scrollingContainer: Element) {
  const minScroll = {
    x: 0,
    y: 0,
  };

  const maxScroll = {
    x: scrollingContainer.scrollWidth - scrollingContainer.clientWidth,
    y: scrollingContainer.scrollHeight - scrollingContainer.clientHeight,
  };

  const isTop = scrollingContainer.scrollTop <= minScroll.y;
  const isLeft = scrollingContainer.scrollLeft <= minScroll.x;

  const isBottom = scrollingContainer.scrollTop >= maxScroll.y;
  const isRight = scrollingContainer.scrollLeft >= maxScroll.x;

  return {
    isTop,
    isLeft,
    isBottom,
    isRight,
    maxScroll,
    minScroll,
  };
}

export default getScrollPosition;
