import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import TextField from '@material-ui/core/TextField'
import Autocomplete, { AutocompleteChangeReason, AutocompleteInputChangeReason } from '@material-ui/core/Autocomplete'
import Tooltip from '@material-ui/core/Tooltip'
import CircularProgress from '@material-ui/core/CircularProgress'
import Highlighter from 'react-highlight-words'
import { snooze } from '@au5ton/snooze'
import { searchInputAtom } from '../lib/recoil'
import { SearchResult, useSearchResults } from '../lib/data/useSearchResults'
import { Emoji } from './emoji'
import { Badge } from './badge'
import { isMobile } from '../lib/util'
import styles from './search.module.scss'

type SearchListItemProps = React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement> & {
  option: SearchResult;
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

  // For state management
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<SearchResult>(null);
  const [inputValue, setInputValue] = useState<string>('');
  // For actually performing searches
  const { data: options, isValidating: loading } = useSearchResults(inputValue)

  // For responding to searches
  const router = useRouter();
  useEffect(() => {
    if(value !== null) {
      // unselect the searchbar after choosing a result
      elementRef.current.blur();
      router.push(value.href)
    }
  }, [value])

  const handleSelect = () => {
    if(elementRef.current !== null) {
      // improve mobile UX by moving input field to the top of the viewport
      if(isMobile()) window.scrollTo(0, window.pageYOffset + elementRef.current.getBoundingClientRect().top)
    }
  }

  // For creating search result items
  const SearchListItem = (props: SearchListItemProps) => {
    const { option } = props

    return (
      <li {...props}>
        <div className={styles.searchListItem}>
          <div>
            <Highlighter
              highlightClassName={styles.highlight}
              searchWords={[inputValue]}
              autoEscape={true}
              textToHighlight={option.title}
            />
          </div>
          <div className={styles.badgeList}>
            {option.badges.map(e => (
              <Badge key={e.key} style={{ backgroundColor: e.color }}>{e.text}</Badge>
            ))}
          </div>
        </div>
      </li>
    )
  }

  return (
    <Autocomplete
      openOnFocus
      autoHighlight
      freeSolo
      classes={{ groupLabel: styles.groupLabel }}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onChange={(_, x) => { if(typeof x !== 'string') setValue(x) }}
      onInputChange={(_, x) => setInputValue(x)}
      value={value}
      inputValue={inputValue}
      isOptionEqualToValue={(option, value) => option.title === value.title}
      getOptionLabel={(option) => option.title}
      groupBy={(option) => option.group}
      options={options}
      loading={loading}
      //filterOptions={(x) => x}
      renderOption={(props, option) => <SearchListItem {...props} option={option} />}
      renderInput={(params) => (
        <TextField 
          {...params}
          inputRef={elementRef}
          className={styles.textField}
          onSelect={handleSelect}
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
