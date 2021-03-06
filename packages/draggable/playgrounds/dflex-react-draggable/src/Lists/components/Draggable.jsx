/* eslint-disable import/no-extraneous-dependencies */

import React from "react";
import { keyGenerator } from "@folo/utils";

// eslint-disable-next-line import/no-unresolved
import { store } from "@dflex/draggable";

const Draggable = (props) => {
  const {
    component: DraggableComponent = "div",
    id: idProps,
    children,
    ...rest
  } = props;

  const ref = React.createRef();

  const [id] = React.useState(
    idProps || `${keyGenerator(new Date().getTime())}`
  );

  React.useEffect(() => {
    setTimeout(
      // eslint-disable-next-line func-names
      () => {
        store.register({ id, ref: ref.current });
      },
      0
    );
  }, [id, ref]);

  return (
    <DraggableComponent ref={ref} key={id} id={id} {...rest}>
      {children}
    </DraggableComponent>
  );
};

export default Draggable;
