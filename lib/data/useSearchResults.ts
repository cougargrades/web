import React, { useState, useEffect, CSSProperties } from 'react'
import { getGradeForGPA, getGradeForStdDev, grade2Color } from '../../components/badge'
import { randRange } from '../util'
import { SWRResponse } from './SWRResponse'

export interface SearchResultBadge {
  key: string;
  text: string;
  color: string;
}

export interface SearchResult {
  key: string; // used for react, same as document path
  href: string; // where to redirect the user when selected
  type: 'course' | 'instructor' | 'group';
  group: string; // What to display in the <li> divider in the search results
  title: string; // What the result is
  badges: SearchResultBadge[]
}

export function useSearchResults(inputValue: string): SWRResponse<SearchResult[]> {
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])
  
  return {
    data: isLoading ? [] : data.filter(e => e.title.toLowerCase().includes(inputValue.toLowerCase())),
    error: undefined,
    isValidating: isLoading
  }
}

const gpa_1 = randRange(1.0, 4.0);
const gpa_2 = randRange(1.0, 4.0);
const sd_1 = randRange(0.14, 0.43);
const sd_2 = randRange(0.14, 0.43);

const data: SearchResult[] = [
  {
    key: '/catalog/COSC 2430',
    href: '/c/COSC 2430',
    type: 'course',
    group: '📚 Courses',
    title: 'COSC 2430',
    badges: [
      { key: 'gpa', text: `${gpa_1.toPrecision(3)} GPA`, color: grade2Color.get(getGradeForGPA(gpa_1)) },
      { key: 'sd', text: `${sd_1.toPrecision(3)} SD`, color: grade2Color.get(getGradeForStdDev(sd_1)) }
    ],
  },
  {
    key: '/catalog/MATH 3336',
    href: '/c/MATH 3336',
    type: 'course',
    group: '📚 Courses',
    title: 'MATH 3336',
    badges: [
      { key: 'gpa', text: `${gpa_2.toPrecision(3)} GPA`, color: grade2Color.get(getGradeForGPA(gpa_2)) },
      { key: 'sd', text: `${sd_2.toPrecision(3)} SD`, color: grade2Color.get(getGradeForStdDev(sd_2)) }
    ],
  },
  {
    key: '/instructor/Reynolds, Ryan',
    href: '/i/Reynolds, Ryan',
    type: 'instructor',
    group: '👩‍🏫 Instructors',
    title: 'Reynolds, Ryan',
    badges: [
      { key: 'gpa', text: `${gpa_1.toPrecision(3)} GPA`, color: grade2Color.get(getGradeForGPA(gpa_1)) },
      { key: 'sd', text: `${sd_1.toPrecision(3)} SD`, color: grade2Color.get(getGradeForStdDev(sd_1)) }
    ],
  },
  {
    key: '/instructor/Johansson, Scarlett',
    href: '/i/Johansson, Scarlett',
    type: 'instructor',
    group: '👩‍🏫 Instructors',
    title: 'Johansson, Scarlett',
    badges: [
      { key: 'gpa', text: `${gpa_2.toPrecision(3)} GPA`, color: grade2Color.get(getGradeForGPA(gpa_2)) },
      { key: 'sd', text: `${sd_2.toPrecision(3)} SD`, color: grade2Color.get(getGradeForStdDev(sd_2)) }
    ],
  },
  {
    key: '/groups/10',
    href: '/g/10',
    type: 'group',
    group:  '🗃️ Groups',
    title: 'Communication',
    badges: [],
  },
  {
    key: '/groups/20',
    href: '/g/20',
    type: 'group',
    group:  '🗃️ Groups',
    title: 'Mathematics',
    badges: [],
  }
];
