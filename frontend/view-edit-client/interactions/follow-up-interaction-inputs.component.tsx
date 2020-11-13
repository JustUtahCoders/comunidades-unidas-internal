import React from "react";
import {
  InteractionInputsRef,
  InteractionInputsProps,
} from "./single-interaction-slat.component";

const FollowUpInteractionInputs = React.forwardRef<
  InteractionInputsRef,
  InteractionInputsProps
>((props, ref) => {
  return <div>Follow up inputs not yet implemented.</div>;
});

export default FollowUpInteractionInputs;
