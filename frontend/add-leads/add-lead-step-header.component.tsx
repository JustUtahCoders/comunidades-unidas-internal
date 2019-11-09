import React from "react";
import { useCss } from "kremling";

export default function AddLeadStepHeader(props: AddLeadStepHeaderProps) {
  const scope = useCss(css);

  return (
    <div className="step-header" {...scope}>
      <img src={props.imgSrc} alt={props.imgAlt} />
      <div className="step-header-text">{props.text}</div>
    </div>
  );
}

type AddLeadStepHeaderProps = {
  text: string;
  imgSrc: string;
  imgAlt: string;
};

const css = `
& .step-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 30rem;
  margin: 0 auto;
}

& .step-header img {
  height: 10rem;
}

& .step-header-text {
  margin-top: .8rem;
  text-align: center;
}
`;
