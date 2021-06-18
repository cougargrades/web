import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Icon from '@material-ui/core/Icon'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { makeStyles } from '@material-ui/core/styles'
// import Header from '../components/header'
// import Footer from '../components/footer'
//import styles from './layout.module.scss'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
  },
}));

export default function Layout(props: { children: React.ReactNode }) {
  const classes = useStyles();
  const top100Films = [
    { title: 'The Godfather', year: 1972 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
    { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
    { title: 'The Good, the Bad and the Ugly', year: 1966 },
    { title: 'Fight Club', year: 1999 },
    { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
    { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
    { title: 'Forrest Gump', year: 1994 },
    { title: 'Inception', year: 2010 },
  ];
  const options = top100Films.map((option) => {
    const firstLetter = option.title[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  });

  return (
    // <>
    //   <div className={styles.layout}>
    //     <Header />
    //     {props.children}
    //   </div>
    //   <Footer />
    // </>
    <div className={classes.root}>
      <CssBaseline />
      <AppBar>
        <Toolbar>
          <Typography variant="h6" noWrap>CougarGrades.io</Typography>
            <Autocomplete
              freeSolo
              options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
              groupBy={(option) => option.firstLetter}
              getOptionLabel={(option) => option.title}
              style={{ width: '100%' }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search input"
                  margin="normal"
                  variant="filled"
                  InputProps={{ 
                    ...params.InputProps, 
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon>🔍</Icon>
                    </InputAdornment>),
                    type: 'search' }}
                />
              )}
            />
          
        </Toolbar>
      </AppBar>
      <Container className={classes.main} maxWidth="sm">
        
      </Container>
      <footer className={classes.footer}>
        <Container maxWidth="sm">
          <Typography variant="body1">My sticky footer can be found here.</Typography>
        </Container>
      </footer>
    </div>
  )
}
