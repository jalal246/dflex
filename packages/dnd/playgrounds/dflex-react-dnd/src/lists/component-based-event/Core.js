/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable import/no-extraneous-dependencies */

import React from "react";

import { store, DnD } from "@dflex/dnd";

// shared dragged event
let draggedEvent;

const Core = ({
  component: CoreComponent = "div",
  id,
  children,
  depth,
  ...rest
}) => {
  const ref = React.useRef();

  const [isDragged, setIsDragged] = React.useState(false);

  React.useEffect(() => {
    setTimeout(
      // eslint-disable-next-line func-names
      () => {
        store.register({ id, ref: ref.current, depth });
      },
      0
    );
  }, []);

  const onMouseUp = () => {
    if (draggedEvent) {
      draggedEvent.endDragging();
      draggedEvent = null;
      setIsDragged(false);
    }
  };

  const onMouseMove = (e) => {
    if (draggedEvent) {
      const { clientX, clientY } = e;

      draggedEvent.dragAt(clientX, clientY);
    }
  };

  const onMouseDown = (e) => {
    e.stopPropagation();

    const { button, clientX, clientY } = e;

    // avoid right mouse click and ensure id
    if (typeof button === "number" && button === 0) {
      if (id) {
        draggedEvent = new DnD(id, { x: clientX, y: clientY });

        setIsDragged(true);
      }
    }
  };

  return (
    <CoreComponent
      ref={ref}
      key={id}
      id={id}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      style={
        isDragged
          ? {
              background: "pink",
              transition: "opacity 0.2s cubic-bezier(0.2, 0, 0, 1) 0s",
            }
          : {}
      }
      {...rest}
    >
      {children}
    </CoreComponent>
  );
};

export default Core;
