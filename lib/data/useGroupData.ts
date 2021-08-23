import React, { useState, useEffect } from 'react'
import { usePrevious } from 'react-use'
import { Course, Util } from '@cougargrades/types'
import { Observable } from './Observable'
import { GroupResult, course2Result,  } from './useAllGroups'
import { CourseInstructorResult } from './useCourseData'

export function useGroupData(data: GroupResult): Observable<CourseInstructorResult[]> {
  const [courseData, setCourseData] = useState<Course[]>([]);
  const previous = usePrevious(data.key)

  useEffect(() => {
    // prevent loading the same data again
    if(previous !== data.key) {
      setCourseData([]);
      (async () => {
        if(Array.isArray(data.courses) && Util.isDocumentReferenceArray(data.courses)) {
          setCourseData(
            (await Util.populate<Course>(data.courses))
              // filter out undefined because there might be some empty references
              .filter(e => e !== undefined)
              // sort courses by total enrolled
              .sort((a,b) => b.enrollment.totalEnrolled - a.enrollment.totalEnrolled)
            ) 
        }
      })();
    }
    
  }, [data,previous])

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
