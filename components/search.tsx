import React, { useState, useEffect, useRef } from 'react'
import { useRecoilState } from 'recoil'
import TextField from '@material-ui/core/TextField'
import Autocomplete, { AutocompleteChangeReason, AutocompleteInputChangeReason } from '@material-ui/core/Autocomplete'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import { snooze } from '@au5ton/snooze'
import { searchInputAtom } from '../lib/recoil'
import styles from './search.module.scss'

type SearchListItemProps = React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement> & {
  option: Film;
}

interface Film {
  firstLetter: string;
  title: string;
  year: number;
}

export function extractParts(optionLabel: string, inputValue: string): [string, string] {
  return [
    optionLabel.substring(0, inputValue.length),
    optionLabel.substring(inputValue.length)
  ]
}

export default function SearchBar() {
  // For letting other components focus here
  const elementRef = useRef<HTMLInputElement>(null);
  const [_, setRef] = useRecoilState(searchInputAtom);

  /**
   * we're going to do something kinda strange, but we're going 
   * to use Recoil (tl;dr useState but across multiple components)
   * to save the ref of the <input> element across any component that wants it.
   * 
   * this is for the specific purpose of being able to focus the search bar from
   * any component we want to.
   */
  useEffect(() => {
    if(elementRef.current !== null) {
      setRef(elementRef.current)
    }
  }, [elementRef])

  // For actually performing searches
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Film[]>([]);
  const loading = open && options.length === 0;
  // For responding to searches
  const [value, setValue] = useState<Film>(null);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await snooze(1e3); // For demo purposes.

      if (active) {

        setOptions([...topFilms.map((option) => {
          const firstLetter = option.title[0].toUpperCase();
          return {
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
            ...option,
          };
        })]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading])

  const handleResultSelected = (_: any, value: Film, reason: AutocompleteChangeReason) => {
    setValue(value)
    console.log('result selected!', value)
  }

  const handleInputChanged = (_: any, value: string, reason: AutocompleteInputChangeReason) => {
    setInputValue(value);
    console.log('typed:', value)
  }

  const SearchListItem = (props: SearchListItemProps) => {
    const { option } = props
    
    const parts = extractParts(option.title, inputValue)

    return (
      <li {...props}><span><strong>{parts[0]}</strong>{parts[1]}</span></li>
    )
  }

  return (
    <Autocomplete
      openOnFocus
      autoHighlight
      freeSolo
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onChange={handleResultSelected}
      onInputChange={handleInputChanged}
      value={value}
      inputValue={inputValue}
      isOptionEqualToValue={(option, value) => option.title === value.title}
      getOptionLabel={(option) => option.title}
      groupBy={(option) => option.firstLetter}
      options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
      loading={loading}
      //filterOptions={(x) => x}
      renderOption={(props, option) => <SearchListItem {...props} option={option} />}
      renderInput={(params) => (
        <TextField 
          {...params}
          inputRef={elementRef}
          className={styles.textField}
          label="🔍 Search"
          helperText="Please enter course or instructor. Example: ENGL 1304, Renu Khator"
          type="search"
          variant="outlined"
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
              {loading ? <CircularProgress color="inherit" size={20} /> : null}
              {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
    />
  )
}

const topFilms = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
  },
  {
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980,
  },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  {
    title: 'The Lord of the Rings: The Two Towers',
    year: 2002,
  },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  {
    title: 'Star Wars: Episode IV - A New Hope',
    year: 1977,
  },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
];

