import { useMemo } from 'react'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { createMuiTheme } from '@material-ui/core/styles'

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
        },
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return theme;
}