import { Course, Enrollment, Group, Instructor, Section, Util } from '@cougargrades/types';
import { Grade, grade2Color } from '../../../components/badge';
import { Column, descendingComparator } from '../../../components/datatable';
import { getRosetta } from '../../i18n';
import { estimateClassSize, getTotalEnrolled, getYear, seasonCode } from '../../util';
import { getBadges } from '../getBadges';
import { getChartData } from '../getChartData';
import { CourseResult, group2Result, instructor2Result, SectionPlus } from '../useCourseData'
import { getFirestoreDocument } from './getFirestoreData';

/**
 * Used in serverless functions
 * @param courseName 
 * @returns 
 */
export async function getCourseData(courseName: string): Promise<CourseResult> {
  const stone = getRosetta()
  const data = await getFirestoreDocument<Course>(`/catalog/${courseName}`)
  const didLoadCorrectly = data !== undefined && typeof data === 'object' && Object.keys(data).length > 1

  const settledData = await Promise.allSettled([
    (data && Array.isArray(data.groups) && Util.isDocumentReferenceArray(data.groups) ? Util.populate<Group>(data.groups) : Promise.resolve<Group[]>([])),
    (data && Array.isArray(data.instructors) && Util.isDocumentReferenceArray(data.instructors) ? Util.populate<Instructor>(data.instructors) : Promise.resolve<Instructor[]>([])),
    (data && Array.isArray(data?.sections) && Util.isDocumentReferenceArray(data.sections) ? Util.populate<Section>(data.sections) : Promise.resolve<Section[]>([])),
  ]);
  
  const [groupDataSettled, instructorDataSettled, sectionDataSettled] = settledData;
  const groupData = groupDataSettled.status === 'fulfilled' ? groupDataSettled.value : [];
  const instructorData = instructorDataSettled.status === 'fulfilled' ? instructorDataSettled.value : [];
  const sectionData = sectionDataSettled.status === 'fulfilled' ? sectionDataSettled.value : [];

  const classSize = didLoadCorrectly ? estimateClassSize(data.enrollment, sectionData) : 0

  return {
    badges: [
      ...(didLoadCorrectly ? getBadges(data.GPA, data.enrollment) : []),
    ],
    publications: [
      ...(didLoadCorrectly && data.publications !== undefined && Array.isArray(data.publications) ? data.publications.map(e => (
        {
          ...e,
          key: `${e.catoid}|${e.coid}`
        }
      )).sort((a,b) => descendingComparator(a, b, 'catoid')).slice(0,3) : [])
    ],
    tccnsUpdates: [
      ...(didLoadCorrectly && data.tccnsUpdates !== undefined && Array.isArray(data.tccnsUpdates) ? data.tccnsUpdates : []),
    ],
    firstTaught: didLoadCorrectly ? `${stone.t(`season.${seasonCode(data.firstTaught)}`)} ${getYear(data.firstTaught)}` : '',
    lastTaught: didLoadCorrectly ? `${stone.t(`season.${seasonCode(data.lastTaught)}`)} ${getYear(data.lastTaught)}` : '',
    relatedGroups: [
      /**
       * 2025-07-13: This is in reverse alphabetical order.
       * Why? So that "2024-2025" appears before "2021-2022", even if "English" appears before "Communication".
       * I suppose this could be more sophisticated, but that's a lot of work.
       */
      ...(didLoadCorrectly ? groupData.sort((a,b) => b.name.localeCompare(a.name)).map(e => group2Result(e)) : [])
    ],
    relatedInstructors: [
      ...(didLoadCorrectly ? instructorData.sort((a,b) => b.enrollment.totalEnrolled - a.enrollment.totalEnrolled).map(e => instructor2Result(e)) : [])
    ],
    dataGrid: {
      columns: [
        /**
         * I don't think these columns matter on the back-end because functions can't be serialized anyway
         */
      ],
      rows: [
        ...(didLoadCorrectly ? sectionData.sort((a,b) => b.term - a.term).map(e => ({
          ...e,
          id: e._id,
          primaryInstructorName: Array.isArray(e.instructorNames) ? `${e.instructorNames[0].lastName}, ${e.instructorNames[0].firstName}` : '',
          instructors: [],
          totalEnrolled: getTotalEnrolled(e),
        })) : [])
      ],
    },
    dataChart: {
      data: [
        ...(didLoadCorrectly ? getChartData(sectionData) : [])
      ],
      // https://developers.google.com/chart/interactive/docs/gallery/linechart?hl=en#configuration-options
      options: {
        title: `${courseName} Average GPA Over Time by Instructor`,
        vAxis: {
          title: 'Average GPA',
          gridlines: {
            count: -1 //auto
          },
          maxValue: 4.0,
          minValue: 0.0
        },
        hAxis: {
          title: 'Semester',
          gridlines: {
            count: -1 //auto
          },
          textStyle: {
            fontSize: 12
          },
        },
        chartArea: {
          //width: '100%',
          //width: '55%',
          //width: '65%',
          left: 'auto',
          //left: 65, // default 'auto' or 65
          right: 'auto',
          //right: 35, // default 'auto' or 65
          //left: (window.innerWidth < 768 ? 55 : (window.innerWidth < 992 ? 120 : null))
        },
        legend: {
          position: 'bottom'
        },
        pointSize: 5,
        interpolateNulls: true //lines between point gaps
      }
    },
    enrollment: [
      ...(didLoadCorrectly ? 
          data.enrollment.totalEnrolled === 0 ? 
          [{ key: 'nodata', title: 'No data', color: grade2Color['I'], value: -1, percentage: 100 }] : 
          (['totalA','totalB','totalC','totalD','totalF','totalS','totalNCR','totalW'] as (keyof Enrollment)[])
          .map(k => ({
            key: k,
            title: k.substring(5), // 'totalA' => 'A'
            color: grade2Color[k.substring(5) as Grade] ?? grade2Color['I'],
            value: data.enrollment[k],
            percentage: data.enrollment[k] !== undefined && data.enrollment.totalEnrolled !== 0 ? data.enrollment[k] / data.enrollment.totalEnrolled * 100 : 0,
          })
      ) : []),
    ],
    instructorCount: didLoadCorrectly ? Array.isArray(data.instructors) ? data.instructors.length : 0 : 0,
    sectionCount: didLoadCorrectly ? Array.isArray(data.sections) ? data.sections.length : 0 : 0,
    //classSize: didLoadCorrectly && Array.isArray(data.sections) ? data.enrollment.totalEnrolled / data.sections.length : 0,
    //classSize: didLoadCorrectly ? data.enrollment.totalEnrolled / sectionData.filter(sec => getTotalEnrolled(sec) > 0).length : 0,
    classSize,
    sectionLoadingProgress: 100,
  };
}
