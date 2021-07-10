/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable react/no-array-index-key */
import React from "react";
import s from "../Demo.module.css";

import DnDItem from "./DnDItem";

const ExtendedList = () => {
  const tasks = [];

  for (let i = 1; i <= 1000; i += 1) {
    const uni = `${i}-extended`;

    tasks.push({ id: uni, key: uni, task: `${i}` });
  }

  return (
    <div className={s.root}>
      <div className={s.todo}>
        <ul>
          {tasks.map(({ task, id, key }) => (
            <DnDItem id={id} key={key} task={task} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExtendedList;