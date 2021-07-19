import React, { useState, useEffect } from 'react'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { Course, Instructor, Group } from '@cougargrades/types'
import { getGradeForGPA, getGradeForStdDev, grade2Color } from '../../components/badge'
import { randRange } from '../util'
import { Observable } from './Observable'

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

export function course2Result(data: Course): SearchResult {
  return {
    key: data._path,
    href: `/c/${data._id}`,
    type: 'course',
    group: '📚 Courses',
    title: `${data._id}: ${data.description}`,
    badges: [
      { key: 'gpa', text: `${data.GPA.average.toPrecision(3)} GPA`, color: grade2Color.get(getGradeForGPA(data.GPA.average)) },
      { key: 'sd', text: `${data.GPA.standardDeviation.toPrecision(3)} SD`, color: grade2Color.get(getGradeForStdDev(data.GPA.standardDeviation)) }
    ],
  };
}

export function instructor2Result(data: Instructor): SearchResult {
  return {
    key: data._path,
    href: `/i/${data._id}`,
    type: 'instructor',
    group: '👩‍🏫 Instructors',
    title: data._id,
    badges: [
      { key: 'gpa', text: `${data.GPA.average.toPrecision(3)} GPA`, color: grade2Color.get(getGradeForGPA(data.GPA.average)) },
      { key: 'sd', text: `${data.GPA.standardDeviation.toPrecision(3)} SD`, color: grade2Color.get(getGradeForStdDev(data.GPA.standardDeviation)) }
    ],
  };
}

export function group2Result(data: Group): SearchResult {
  return {
    key: data.identifier,
    href: `/g/${data.identifier}`,
    type: 'group',
    group: '🗃️ Groups',
    title: `${data.name} (${data.identifier})`,
    badges: [],
  };
}

function getFirst<T>(arr: (T | undefined)[]): T | undefined {
  const subset = arr.filter(e => e !== undefined);
  if(subset.length > 0) {
    return subset[0]
  }
  return undefined
}

export function useSearchResults(inputValue: string): Observable<SearchResult[]> {
  const SEARCH_RESULT_LIMIT = 3;
  const db = useFirestore()
  const courseQuery = db.collection('catalog').where('keywords', 'array-contains', inputValue.toLowerCase()).orderBy('_id').limit(SEARCH_RESULT_LIMIT)
  const courseData = useFirestoreCollectionData<Course>(courseQuery)
  const instructorQuery = db.collection('instructors').where('keywords', 'array-contains', inputValue.toLowerCase()).orderBy('lastName').limit(SEARCH_RESULT_LIMIT)
  const instructorData = useFirestoreCollectionData<Instructor>(instructorQuery)
  const groupQuery = db.collection('groups').where('keywords', 'array-contains', inputValue.toLowerCase()).orderBy('name').limit(SEARCH_RESULT_LIMIT)
  const groupData = useFirestoreCollectionData<Group>(groupQuery)

  return {
    data: [
      ...(courseData.status === 'success' ? courseData.data.map(e => course2Result(e)) : []),
      ...(instructorData.status === 'success' ? instructorData.data.map(e => instructor2Result(e)) : []),
      ...(groupData.status === 'success' ? groupData.data.map(e => group2Result(e)) : []),
    ],
    error: getFirst([courseData.error, instructorData.error, groupData.error]),
    status: inputValue === '' ? 'success' : [courseData.status, instructorData.status, groupData.status].some(e => e === 'loading') ? 'loading' : 'success'
  }
}
