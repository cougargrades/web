import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import TextField from '@mui/material/TextField'
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Highlighter from 'react-highlight-words'
import NProgress from 'nprogress'
import { logEvent } from 'firebase/analytics'
import { searchInputAtom } from '../lib/recoil'
import { SearchResult, useLiteSearchResults, useSearchResults } from '../lib/data/useSearchResults'
import { Badge } from './badge'
import { isMobile } from '../lib/util'
import { useAnalyticsRef } from '../lib/firebase'

import styles from './search.module.scss'


type SearchListItemProps = React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement> & {
  option: SearchResult;
}

export default function SearchBar() {
  // For analytics
  const analyticsRef = useAnalyticsRef()

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
  const [value, setValue] = useState<SearchResult | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [wasOpen, setWasOpen] = useState(false)
  // For actually performing searches
  const { data, status } = useLiteSearchResults(inputValue, wasOpen)
  const loading = status !== 'success'

  useEffect(() => {
    if(open) setWasOpen(true)
  }, [open])

  // For analytics
  useEffect(() => {
    if(analyticsRef.current !== null && inputValue.length > 0) {
      logEvent(analyticsRef.current, 'search', {
        search_term: inputValue
      })
    }
  }, [analyticsRef, inputValue])

  // For responding to searches and redirecting
  const router = useRouter();
  // Used for displaying rerouting progress bar
  useEffect(() => {
    const handleStart = () => {
      console.time('reroute')
      NProgress.start()
    }
    const handleStop = () => {
      NProgress.done()
      console.timeEnd('reroute')
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])

  // Used for prefetching all options which are presented
  useEffect(() => {
    if (data) {
      for(let item of data) {
        router.prefetch(item.href);
      }
    }
  }, [data]);

  // Used for actually issuing the redirect
  const handleChange: AutocompleteProps<SearchResult, undefined, undefined, boolean | undefined>['onChange'] = (event, x) => {
    if(typeof x !== 'string' && x !== null) {
      // update the state
      setInputValue(x.title)
      setValue(null)
      // unselect the searchbar after choosing a result
      elementRef.current?.blur()
      // redirect to the selected result
      router.push(x.href, undefined, { scroll: false })
    }
  }

  // improve mobile UX by moving input field to the top of the viewport
  const handleSelect = () => {
    if(elementRef.current !== null) {
      const rect = elementRef.current.getBoundingClientRect()
      if(isMobile() || (rect.top - 10) < 0) {
        window.scrollTo(0, window.pageYOffset + rect.top - 20)
      }
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
    <>
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1}} open={open}></Backdrop>
      <Autocomplete<SearchResult, undefined, undefined, boolean | undefined>
        openOnFocus
        autoHighlight
        freeSolo
        classes={{ root: styles.autocompleteRoot, groupLabel: styles.groupLabel }}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onChange={handleChange}
        onInputChange={(_, x) => setInputValue(x)}
        value={value}
        inputValue={inputValue}
        isOptionEqualToValue={(option, value) => option.key === value.key}
        getOptionLabel={(option) => typeof option === 'string' ? option : option.title}
        groupBy={(option) => option.group}
        options={data ?? []}
        loading={loading}
        filterOptions={(x) => x}
        renderOption={(props, option) => <SearchListItem {...props} key={option.key} option={option} />}
        renderInput={(params) => (
          <TextField 
            {...params}
            inputRef={elementRef}
            className={styles.textField}
            onSelect={handleSelect}
            label="🔍 Search"
            helperText={`Please enter course or instructor. Example: MATH 1310, Renu Khator, College Algebra`}
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
    </>
  )
}

export function SearchBarSkeleton() {
  return (
    <TextField 
      className={styles.textField}
      label="🔍 Search"
      helperText={`Please enter course or instructor. Example: MATH 1310, Renu Khator, College Algebra`}
      type="search"
      variant="outlined"
      fullWidth
    />
  )
}
