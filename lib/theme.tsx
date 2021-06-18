import { useMemo } from 'react'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { createMuiTheme } from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red';

export function useTheme() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createMuiTheme({
        typography: {
          fontFamily: `'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
          h1: {
            fontWeight: 700
          },
          h2: {
            fontWeight: 700
          },
          h3: {
            fontWeight: 700
          },
          h4: {
            fontWeight: 700
          },
          h5: {
            fontWeight: 700
          },
          h6: {
            fontWeight: 700
          },
          button: {
            fontWeight: 700
          }
        },
        palette: {
          primary: {
            main: UHColors.uh_red,
          },
          secondary: {
            main: UHColors.uh_gold,
          },
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return theme;
}


export const UHColors = {
  uh_red: '#c8102e',
  uh_brick: '#960C22',
  uh_chocolate: '#640817',

  uh_teal: '#00b388',
  uh_green: '#00866C',
  uh_forest: '#005950',

  uh_gold: '#F6BE00',
  uh_mustard: '#D89B00',
  uh_ocher: '#B97800',

  uh_grey: '#888b8d',
  uh_slate: '#54585a',
  uh_black: '#000000',

  uh_cream: '#fff9d9',
  uh_white: '#ffffff',

  /*
    * UH Custom
    */
  uh_maya_blue: '#65B2FE',
  uh_orchid: '#DC89DC',
  
  /*
    * Color scheme inspired by aggiescheduler.com
    */
  grade_a: 'rgb(135, 206, 250)',
  grade_b: 'rgb(144, 238, 144)',
  grade_c: 'rgb(255, 255, 0)',
  grade_d: 'rgb(255, 160, 122)',
  grade_f: 'rgb(205, 92, 92)',
  grade_i: 'rgb(211, 211, 211)',
  grade_q: 'rgb(138, 43, 226)',
  grade_text: 'rgba(0, 0, 0, 0.54)',
  grade_stddev_high: '#4169e1',
  grade_stddev_low: 'rgb(155, 173, 226)',
}
