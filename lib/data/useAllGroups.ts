import { useEffect, useState } from 'react'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { Course, Group, Util } from '@cougargrades/types'
import { DocumentReference } from '@cougargrades/types/dist/FirestoreStubs'
import { getGradeForGPA, getGradeForStdDev, grade2Color } from '../../components/badge'
import { Observable } from './Observable'
import { CourseInstructorResult } from './useCourseData';

export interface AllGroupsResult {
  core_curriculum: GroupResult[];
  //all_groups: GroupResult[];
}

export interface GroupResult {
  key: string;
  href: string;
  title: string;
  description: string;
  courses: DocumentReference<Course>[];
}

export function group2Result(data: Group): GroupResult {
  return {
    key: data.identifier,
    href: `/g/${data.identifier}`,
    title: data.name,
    description: data.description,
    courses: data.courses as DocumentReference<Course>[],
  }
}

export function course2Result(data: Course): CourseInstructorResult {
  return {
    key: data._path,
    href: `/c/${data._id}`,
    title: `${data.department} ${data.catalogNumber}`,
    subtitle: data.description,
    caption: `${Array.isArray(data.instructors) ? data.instructors.length : 0} instructors • ${Array.isArray(data.sections) ? data.sections.length : 0} sections`,
    badges: [
      ...(data.GPA.average !== 0 ? [{ key: 'gpa', text: `${data.GPA.average.toFixed(2)} GPA`, color: grade2Color.get(getGradeForGPA(data.GPA.average)) }] : []),
      ...(data.GPA.standardDeviation !== 0 ? [{ key: 'sd', text: `${data.GPA.standardDeviation.toFixed(3)} SD`, color: grade2Color.get(getGradeForStdDev(data.GPA.standardDeviation)) }] : []),
      ...(data.enrollment !== undefined ? [{ key: 'droprate', text: `${(data.enrollment.totalW/data.enrollment.totalEnrolled*100).toFixed(2)}% W`, color: grade2Color.get('W') }] : []),
    ],
    id: data._id,
    lastInitial: '',
  };
}

export function useAllGroups(): Observable<AllGroupsResult> {
  const db = useFirestore();
  const query = db.collection('groups').where('categories', 'array-contains', 'UH Core Curriculum')
  const { data, status, error } = useFirestoreCollectionData<Group>(query)

  return {
    data: {
      core_curriculum: [
        ...(status === 'success' ? data.filter(e => Array.isArray(e.categories) && e.categories.includes('UH Core Curriculum')).map(e => group2Result(e)) : [])
      ],
      // all_groups: [
      //   ...(status === 'success' ? data.filter(e => Array.isArray(e.categories) && ! e.categories.includes('UH Core Curriculum')).map(e => group2Result(e)) : [])
      // ],
    },
    error,
    status,
  }
}

export function useGroupCoursesData(courses: DocumentReference<Course>[]): Observable<CourseInstructorResult[]> {
  const [courseData, setCourseData] = useState<Course[]>([]);

  useEffect(() => {
    setCourseData([]);
    (async () => {
      if(Array.isArray(courses) && Util.isDocumentReferenceArray(courses)) {
        setCourseData(
          (await Util.populate<Course>(courses))
            // filter out undefined because there might be some empty references
            .filter(e => e !== undefined)
            // sort courses by total enrolled
            .sort((a,b) => b.enrollment.totalEnrolled - a.enrollment.totalEnrolled)
          ) 
      }
    })();
  }, [courses])

  try {
    return {
      data: [
        ...courseData.map(e => course2Result(e))
      ],
      error: undefined,
      status: courseData.length === 0 ? 'loading' : 'success',
    }
  }
  catch(error) {
    return {
      data: undefined,
      error,
      status: 'error',
    }
  }
}
