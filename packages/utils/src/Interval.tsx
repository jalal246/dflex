/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

class Interval {
  intervalID: number | null;

  constructor() {
    this.intervalID = null;
  }

  setInterval(cbFunc: Function, duration = 5) {
    this.intervalID = setInterval(cbFunc, duration);
  }

  clearInterval() {
    if (this.intervalID) {
      clearInterval(this.intervalID);
      this.intervalID = null;
    }
  }
}

export default Interval;
