import React from "react";
import { useCss } from "kremling";

type StyleguideProps = {
  children: JSX.Element | JSX.Element[];
};

export default function Styleguide(props: StyleguideProps) {
  const scope = useCss(css);

  return <div {...scope}>{props.children}</div>;
}

export const boxShadow1: BoxShadow = `0 10rem 30rem -24rem #4b4e53`;
export const boxShadow2: BoxShadow = `0 10rem 40rem -24rem #393b3f`;
export const boxShadow3: BoxShadow = `0 16px 50px -24px #a3a3a3`;
export const boxShadow4: BoxShadow = `0 4px 8px 0 rgba(0, 0, 0, 0.06), 0 2px 6px 0 rgba(0, 0, 0, 0.26)`;
export const mediaMobile: String = `@media screen and (max-width: 800px) and (min-width: 1px)`;
export const mediaDesktop: String = `@media screen and (min-width: 800px)`;

const css = `
:root {
  font-size: 10px;
  font-family: 'Montserrat', sans-serif;
  background-color: #efefef;
  --very-light-gray: #F3F3F3;
  --light-gray: #dfdfdf;
  --medium-gray: #afafaf;
  --very-dark-gray: #3C464D;
  --brand-color: rgba(184, 17, 17, 1);
  --colored-well: blanchedalmond;
}

body {
  font-size: 1.8rem;
  margin: 0;
}

:root * {
  box-sizing: border-box;
}

& .card + .card {
  margin-top: 3.2rem;
}

& .card {
  box-shadow: ${boxShadow1};
  background-color: white;
  border-radius: .3rem;
  padding: 3.2rem;
}

& .card.padding-0 {
  padding: 0;
}

& input {
  font-size: 1.8rem;
  padding: .4rem .6rem;
}

& select {
  font-size: 1.8rem;
  max-width: 25rem;
}

& option {
  font-size: 1.8rem;
}

& textarea {
  font-size: 1.8rem;
  font-family: Montserrat;
}

& .box-shadow-1 {
  box-shadow: ${boxShadow1};
}

& .box-shadow-2 {
  box-shadow: ${boxShadow2};
}

& a.unstyled, a.unstyled:focus, a.unstyled:visited {
  color: inherit;
  text-decoration: none;
}

& button.unstyled {
  display: block;
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;
  border-radius: 0;

  background: transparent;

  /* inherit font & color from ancestor */
  color: inherit;
  font: inherit;

  /* Normalize line-height. Cannot be changed from normal in Firefox 4+. */
  line-height: normal;

  /* Corrects font smoothing for webkit */
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;

  /* Corrects inability to style clickable input types in iOS */
  -webkit-appearance: none;
 }

 & button.unstyled::moz-focus-inner {
  border: 0;
  padding: 0;
 }

& button {
  font-size: 1.8rem;
  border-radius: .6rem;
  padding: .8rem 1.2rem;
  border: none;
  text-align: center;
}

& button.icon {
  padding: .8rem;
  margin: .4rem;
  background-color: transparent;
  border-radius: .6rem;
}

& button.icon:hover {
  background-color: #e9e9e9;
}

& button.icon.active, & .button.icon.active:hover {
  background-color: var(--medium-gray);
}

& button.icon img {
  width: 1.6rem;
  height: 1.6rem;
}

& button + button, & button + a.button, & a.button + button, & a.button + a.button {
  margin-left: 1.6rem;
}

& button.primary, & a.primary {
  background-color: #2f4858;
  color: white;
  transition: background-color .2s;
}

& a.button {
  font-size: 1.8rem;
  border-radius: .6rem;
  padding: .8rem 1.2rem;
  border: none;
  text-align: center;
  text-decoration: none;
}

& button.primary:hover, & a.button.primary:hover {
  background-color: #507b97;
}

& button.secondary, & a.button.secondary {
  background-color: #e9e9e9;
  color: black;
  transition: background-color .2s;
}

& button.secondary:hover, & a.button.secondary:hover {
  background-color: #afafaf;
}

& .popup {
  position: absolute;
  box-shadow: ${boxShadow4};
  background-color: white;
  border-radius: .3rem;
  border: .1rem solid #e9e9e9;
  min-width: 15rem;
  z-index: 100;
}

& .popup ul li {
  padding: .4rem .8rem;
}

& .popup ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

& .popup ul li:hover {
  background-color: #e9e9e9;
}
`;

type Color = string;
type BoxShadow = string;
