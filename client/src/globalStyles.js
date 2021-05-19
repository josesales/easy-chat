import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
    *,
    *::after, /*making the after and before elements generated by the pseudo classes to get the behavior*/
    *::before {
        margin: 0;
        padding: 0;
        box-sizing: inherit; /*inherits from the body*/
    } 

    html {
        font-size: 62.5%; //1rem = 10 pixels // 10px/16px = 62.5%
        //Now instead of change pixel by pixel we can just change the font-size and the size of the elements will change accordingly
        @media only screen and (max-width: 45em) {
          font-size: 50%; //1rem = 12 pixels // 12px/16px = 75%
        }
    }

    body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Alegreya', 'Segoe UI', 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
          sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-image: ${({ theme }) => theme.bodyColorGradient};
        box-sizing: border-box;
      }`;

export default GlobalStyles;