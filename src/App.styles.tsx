import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  body {
    font-family: -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      Helvetica,
      Arial,
      sans-serif,
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol';
  }

  * {
    box-sizing: border-box;
  }

  #root {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(132deg, rgba(0,172,193,1) 0%, rgba(102,187,106,1) 100%);
  }

  h1 {
    width: 100%;
    text-align: center;
    margin: 40px 0;
    font-family: monospace;
    font-weight: 900;
    font-size: 30px;
    color: #D81B60;
  }
`;

export const Wrapper = styled.main`
  width: 90%;
  max-width: 768px;
  box-shadow: 0px 4px 4px rgba(0,0,0,.25);
  min-height: 90vh;
  background: #fff;
`
