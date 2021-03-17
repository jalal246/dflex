/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

import React from "react";

// @ts-expect-error
import { keyGenerator } from "@folo/utils";

import { store } from "@dflex/dnd";

const Core = (props) => {
  const {
    component: CoreComponent = "div",
    id: idProps,
    children,
    depth,
    ...rest
  } = props;

  const ref = React.createRef();

  const [id] = React.useState(
    idProps || `${keyGenerator(new Date().getTime())}`
  );

  const [isDragged, setIsDragged] = React.useState(false);

  function onDragOver() {
    console.log("dragged is over the element!");

    if (!isDragged) setIsDragged(true);
  }

  function onDragLeave() {
    console.log("dragged is leaving the element!");
  }

  // const handlers = { onDragOver, onDragLeave };

  React.useEffect(() => {
    setTimeout(
      // eslint-disable-next-line func-names
      () => {
        store.register({ id, ref: ref.current, depth });
      },
      0
    );
  }, []);

  return (
    <CoreComponent
      ref={ref}
      key={id}
      id={id}
      style={
        isDragged
          ? {
              background: "#bce6eb",
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