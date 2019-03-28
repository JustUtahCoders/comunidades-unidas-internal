import React from 'react'
import {useCss} from 'kremling'

type StyleguideProps = {
  children: JSX.Element,
}

export default function Styleguide(props: StyleguideProps) {
  const scope = useCss(css)

  return (
    <div {...scope}>
      {props.children}
    </div>
  )
}

export const brandColor: Color = `rgba(184, 17, 17, 1)`
export const boxShadow1: BoxShadow = `0 10px 30px -24px #4b4e53` 
export const boxShadow2: BoxShadow = `0 10px 40px -24px #393b3f`

const css = `
:root {
  font-size: 1px;
  font-family: 'Montserrat', sans-serif;
  background-color: #efefef;
}

body {
  font-size: 18rem;
  margin: 0;
}

:root * {
  box-sizing: border-box;
}

& .card {
  box-shadow: ${boxShadow1};
  background-color: white;
  border-radius: 3rem;
  padding: 32rem;
}

& input {
  font-size: 18rem;
  padding: 4rem 6rem;
}

& select {
  font-size: 18rem;
  max-width: 250rem;
}

& option {
  font-size: 18rem;
}

& textarea {
  font-size: 18rem;
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
  font-size: 18rem;
  border-radius: 6rem;
  padding: 8px 12px;
  border: none;
  text-align: center;
}

& button + button {
  margin-left: 16rem;
}

& button.primary, & a.primary {
  background-color: #2f4858;
  color: white;
  transition: background-color .2s;
}

& button.primary:hover, & a.button.primary:hover {
  background-color: #507b97;
}

& button.secondary, & a.secondary {
  background-color: #e9e9e9;
  color: black;
  transition: background-color .2s;
}

& button.secondary:hover, & a.secondary:hover {
  background-color: #afafaf;
}
`

type Color = string
type BoxShadow = string