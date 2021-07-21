import { useEffect, useState } from 'react'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { GridColDef, GridValueFormatterParams, GridValueGetterParams } from '@material-ui/data-grid'
import { Course, Group, Instructor, PublicationInfo, Section, Util } from '@cougargrades/types'
import abbreviationMap from '@cougargrades/publicdata/bundle/com.collegescheduler.uh.subjects/dictionary.json'
import { Observable } from './Observable'
import { SearchResultBadge } from './useSearchResults'
import { getGradeForGPA, getGradeForStdDev, grade2Color } from '../../components/badge'
import { useRosetta } from '../i18n'
import { getYear, seasonCode } from '../util'
import { useIsMobile } from '../hook'

type SectionPlus = Section & { id: string };

export interface CourseResult {
  course: Course;
  badges: SearchResultBadge[];
  publications: (PublicationInfo & { key: string })[];
  firstTaught: string;
  lastTaught: string;
  relatedGroups: CourseGroupResult[];
  relatedInstructors: CourseInstructorResult[];
  dataGrid: {
    columns: GridColDef[];
    rows: SectionPlus[];
  }
}

export interface CourseGroupResult {
  key: string;
  href: string;
  title: string;
  count: number;
}

export interface CourseInstructorResult {
  key: string; // used for react, same as document path
  href: string; // where to redirect the user when selected
  title: string; // typically the instructor's full name (ex: Tyler James Beck)
  subtitle: string; // typically the instructor's associated departments (ex: Applied Music, Music)
  caption: string; // typically the number of courses and sections (ex: 4 courses • 5 sections)
  badges: SearchResultBadge[];
  meta: Instructor;
}

export function group2Result(data: Group): CourseGroupResult {
  return {
    key: data.identifier,
    href: `/g/${data.identifier}`,
    title: `${data.name} (${data.identifier})`,
    count: data.courses_count
  };
}

export function instructor2Result(data: Instructor): CourseInstructorResult {
  return {
    key: data._path,
    href: `/i/${data._id}`,
    title: data.fullName,
    subtitle: generateSubjectString(data),
    caption: `${Array.isArray(data.courses) ? data.courses.length : 0} courses • ${Array.isArray(data.sections) ? data.sections.length : 0} sections`,
    badges: [
      ...(data.GPA.average !== 0 ? [{ key: 'gpa', text: `${data.GPA.average.toPrecision(3)} GPA`, color: grade2Color.get(getGradeForGPA(data.GPA.average)) }] : []),
      ...(data.GPA.standardDeviation !== 0 ? [{ key: 'sd', text: `${data.GPA.standardDeviation.toPrecision(3)} SD`, color: grade2Color.get(getGradeForStdDev(data.GPA.standardDeviation)) }] : []),
      ...(data.enrollment !== undefined ? [{ key: 'droprate', text: `${(data.enrollment.totalQ/data.enrollment.totalEnrolled*100).toPrecision(3)}% W`, color: grade2Color.get('Q') }] : []),
    ],
    meta: data,
  };
}

function generateSubjectString(data: Instructor | undefined): string {
  if(data !== undefined && data !== null && data.departments !== undefined && data.departments !== null) {
    const entries = Object.entries(data.departments).sort((a, b) => b[1] - a[1])
    if(entries.length > 0) {
      return entries.map(e => abbreviationMap[e[0]]).filter(e => e !== undefined).join(', ')
    }
  }
  return '';
}

export function useCourseData(courseName: string): Observable<CourseResult> {
  const stone = useRosetta()
  const isMobile = useIsMobile();
  const db = useFirestore()
  const { data, error, status } = useFirestoreDocData<Course>(db.doc(`/catalog/${courseName}`))
  const didLoadCorrectly = status === 'success' && data !== undefined && typeof data === 'object' && Object.keys(data).length > 1
  const isBadObject = typeof data === 'object' && Object.keys(data).length === 1
  const [instructorData, setInstructorData] = useState<Instructor[]>([]);
  const [groupData, setGroupData] = useState<Group[]>([]);
  const [sectionData, setSectionData] = useState<Section[]>([]);
  console.log(sectionData)
  const sharedStatus = status === 'success' ? isBadObject ? 'loading' : didLoadCorrectly ? 'success' : 'error' : status

  // Remove previously stored instructors whenever we reroute
  useEffect(() => {
    setInstructorData([]);
    setGroupData([]);
    setSectionData([]);
  }, [courseName])

  // Resolve the group data document references
  useEffect(() => {
    const didLoadCorrectly = status === 'success' && data !== undefined && typeof data === 'object' && Object.keys(data).length > 1;
    if(didLoadCorrectly) {
      (async () => {
        if(Array.isArray(data.groups) && Util.isDocumentReferenceArray(data.groups)) {
          setGroupData(await Util.populate<Group>(data.groups))
        }
      })();
    }
  }, [data, status])

  // Resolve the instructor document references
  useEffect(() => {
    const didLoadCorrectly = status === 'success' && data !== undefined && typeof data === 'object' && Object.keys(data).length > 1;
    if(didLoadCorrectly) {
      (async () => {
        if(Array.isArray(data.instructors) && Util.isDocumentReferenceArray(data.instructors)) {
          setInstructorData(await Util.populate<Instructor>(data.instructors))
        }
      })();
    }
  }, [data, status])

  // Resolve the section document references
  useEffect(() => {
    const didLoadCorrectly = status === 'success' && data !== undefined && typeof data === 'object' && Object.keys(data).length > 1;
    if(didLoadCorrectly) {
      (async () => {
        if(Array.isArray(data.sections) && Util.isDocumentReferenceArray(data.sections)) {
          setSectionData(await Util.populate<Section>(data.sections))
        }
      })();
    }
  }, [data, status])

  return {
    data: {
      course: didLoadCorrectly ? data : undefined,
      badges: [
        ...(didLoadCorrectly && data.GPA.average !== 0 ? [
          {
            key: 'gpa',
            text: `${data.GPA.average.toPrecision(3)} GPA`,
            color: grade2Color.get(getGradeForGPA(data.GPA.average)),
            caption: 'Grade Point Average',
          }] : []),
        ...(didLoadCorrectly && data.GPA.standardDeviation !== 0 ? [
          {
            key: 'sd',
            text: `${data.GPA.standardDeviation.toPrecision(3)} SD`,
            color: grade2Color.get(getGradeForStdDev(data.GPA.standardDeviation)),
            caption: 'Standard Deviation',
          }] : []),
        ...(didLoadCorrectly && data.enrollment !== undefined ? [
          {
            key: 'droprate',
            text: `${(data.enrollment.totalQ/data.enrollment.totalEnrolled*100).toPrecision(3)}% W`,
            color: grade2Color.get('Q'),
            caption: 'Drop Rate'
          }] : []),
      ],
      publications: [
        ...(didLoadCorrectly && data.publications !== undefined && Array.isArray(data.publications) ? data.publications.map(e => (
          {
            ...e,
            key: `${e.catoid}|${e.coid}`
          }
        )) : [])
      ],
      firstTaught: didLoadCorrectly ? `${stone.t(`season.${seasonCode(data.firstTaught)}`)} ${getYear(data.firstTaught)}` : '',
      lastTaught: didLoadCorrectly ? `${stone.t(`season.${seasonCode(data.lastTaught)}`)} ${getYear(data.lastTaught)}` : '',
      relatedGroups: [
        ...(didLoadCorrectly ? groupData.map(e => group2Result(e)) : [])
      ],
      relatedInstructors: [
        ...(didLoadCorrectly ? instructorData.sort((a,b) => b.enrollment.totalEnrolled - a.enrollment.totalEnrolled).map(e => instructor2Result(e)) : [])
      ],
      dataGrid: {
        columns: [
          {
            field: 'term',
            headerName: 'Term',
            type: 'number',
            valueFormatter: (params: GridValueFormatterParams) => `${stone.t(`season.${seasonCode(params.value as number)}`)} ${getYear(params.value as number)}`,
            ...(isMobile ? { width: 160 } : { flex: 1 }), // occupy horizontal space appropriately on desktop browsers, but use a fixed size on mobile
          },
          {
            field: 'sectionNumber',
            headerName: 'Section #',
            type: 'number',
            ...(isMobile ? { width: 160 } : { flex: 1 }),
          },
          {
            field: 'instructorNames',
            headerName: 'Instructor',
            type: 'string',
            valueGetter: (params: GridValueGetterParams) => `${params.value[0].lastName}, ${params.value[0].firstName}`,
            ...(isMobile ? { width: 160 } : { flex: 1 }),
          },
          ...(['A','B','C','D','F','Q',].map<GridColDef>(e => ({
            field: e,
            headerName: e,
            type: 'number',
            ...(isMobile ? { width: 30 } : { flex: 0.65 }),
          }))),
          {
            field: 'semesterGPA',
            headerName: 'GPA',
            type: 'number',
            ...(isMobile ? { width: 60 } : { flex: 0.8 }),
          },
        ],
        rows: [
          ...(didLoadCorrectly ? sectionData.sort((a,b) => b.term - a.term).map(e => ({
            id: e._id,
            ...e,
          })) : [])
        ],
      }
    },
    error,
    status: sharedStatus,
  }
}
