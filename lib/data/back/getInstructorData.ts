import { Course, Enrollment, Group, Instructor, Section, Util } from '@cougargrades/types'
import { firebase } from '../../firebase_admin'
import { getFirestoreDocument } from '../../data/back/getFirestoreData'
import { InstructorResult } from '../useInstructorData';
import { getRosetta } from '../../i18n';
import { getBadges } from '../getBadges';
import { Grade, grade2Color } from '../../../components/badge';
import { estimateClassSize, getTotalEnrolled, getYear, seasonCode } from '../../util';
import { group2Result, SectionPlus } from '../useCourseData';
import { course2Result } from '../useAllGroups';
import { Column } from '../../../components/datatable';
import { getChartDataForInstructor } from '../getChartDataForInstructor';
import { getRMPProfessorViewableUrl } from '../rmp';
import { EnrollmentInfoResult } from '@/components/enrollment';
import { getSeasonalAvailability } from '../seasonableAvailability';

/**
 * Used server-side
 */
export async function getInstructorData(instructorName: string): Promise<InstructorResult> {
  const stone = getRosetta()
  const db = firebase.firestore();
  const data = await getFirestoreDocument<Instructor>(`/instructors/${instructorName.toLowerCase()}`)
  const didLoadCorrectly = data !== undefined && typeof data === 'object' && Object.keys(data).length > 1
  const groupRefs = ! didLoadCorrectly ? [] : Object
    .entries(data.departments)
    .sort((a, b) => b[1] - a[1])
    .map(e => e[0])
    .map(e => db.doc(`/groups/${e}`) as FirebaseFirestore.DocumentReference<Group>);

  const settledData = await Promise.allSettled([
    (data && Array.isArray(data.courses) && Util.isDocumentReferenceArray(data.courses) ? Util.populate<Course>(data.courses) : Promise.resolve<Course[]>([])),
    (data && Array.isArray(data?.sections) && Util.isDocumentReferenceArray(data.sections) ? Util.populate<Section>(data.sections) : Promise.resolve<Section[]>([])),
    (data && Array.isArray(groupRefs) && Util.isDocumentReferenceArray(groupRefs) ? Util.populate<Group>(groupRefs) : Promise.resolve<Group[]>([])),
  ]);

  const [courseDataSettled, sectionDataSettled, groupDataSettled] = settledData;
  const courseData = courseDataSettled.status === 'fulfilled' ? courseDataSettled.value : [];
  const sectionData = sectionDataSettled.status === 'fulfilled' ? sectionDataSettled.value : [];
  const groupData = groupDataSettled.status === 'fulfilled' ? groupDataSettled.value : [];

  const classSize = didLoadCorrectly ? estimateClassSize(data.enrollment, sectionData) : 0

  return {
    badges: [
      ...(didLoadCorrectly ? getBadges(data.GPA, data.enrollment) : []),
    ],
    enrollment: [
      ...(didLoadCorrectly ? 
          data.enrollment.totalEnrolled === 0 ? 
          [{ key: 'nodata', title: 'No data', color: grade2Color['I'], value: -1, percentage: 100 }] : 
          (['totalA','totalB','totalC','totalD','totalF','totalS','totalNCR','totalW'] as (keyof Enrollment)[])
          .map<EnrollmentInfoResult>(k => ({
            key: k,
            title: k.substring(5), // 'totalA' => 'A'
            color: grade2Color[k.substring(5) as Grade] ?? grade2Color['I'],
            value: data.enrollment[k],
            percentage: data.enrollment[k] !== undefined && data.enrollment.totalEnrolled !== 0 ? data.enrollment[k] / data.enrollment.totalEnrolled * 100 : 0,
            tooltip: data.enrollment[k] !== undefined && data.enrollment.totalEnrolled !== 0 ? '(?)' : `${data.enrollment[k].toLocaleString()} total students have received ${k.substring(5)}s`,
          })
      ) : []),
    ],
    firstTaught: didLoadCorrectly ? `${stone.t(`season.${seasonCode(data.firstTaught)}`)} ${getYear(data.firstTaught)}` : '',
    lastTaught: didLoadCorrectly ? `${stone.t(`season.${seasonCode(data.lastTaught)}`)} ${getYear(data.lastTaught)}` : '',       
    relatedGroups: [
      ...(didLoadCorrectly ? groupData.map(e => group2Result(e)) : [])
    ],
    relatedCourses: [
      ...(didLoadCorrectly ? courseData.sort((a,b) => b.enrollment.totalEnrolled - a.enrollment.totalEnrolled).map(e => course2Result(e)) : [])
    ],
    sectionDataGrid: {
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
    courseDataGrid: {
      columns: [
        /**
         * I don't think these columns matter on the back-end because functions can't be serialized anyway
         */
      ],
      rows: [
        ...(courseData.sort((a,b) => b._id.localeCompare(a._id)).map(e => ({
          ...e,
          id: e._id,
          instructorCount: Array.isArray(e.instructors) ? e.instructors.length : 0,
          instructors: [],
          sectionCount: Array.isArray(e.sections) ? e.sections.length : 0,
          sections: [],
          groups: [],
          gradePointAverage: e.GPA.average,
          standardDeviation: e.GPA.standardDeviation,
          dropRate: e.enrollment !== undefined ? (e.enrollment.totalW/e.enrollment.totalEnrolled*100) : NaN,
          totalEnrolled: e.enrollment !== undefined ? e.enrollment.totalEnrolled : NaN,
          classSize: e.enrollment !== undefined && Array.isArray(e.sections) ? (e.enrollment.totalEnrolled / e.sections.length) : NaN,
        })))
      ],
    },
    dataChart: {
      data: [
        ...(didLoadCorrectly ? getChartDataForInstructor(sectionData) : [])
      ],
      // https://developers.google.com/chart/interactive/docs/gallery/linechart?hl=en#configuration-options
      options: {
        title: `${instructorName} Average GPA Over Time by Course`,
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
          //slantedText: false,
          //showTextEvery: 1,
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
    seasonalAvailability: getSeasonalAvailability(sectionData),
    courseCount: didLoadCorrectly ? Array.isArray(data.courses) ? data.courses.length : 0 : 0,
    sectionCount: didLoadCorrectly ? Array.isArray(data.sections) ? data.sections.length : 0 : 0,
    //classSize: didLoadCorrectly && Array.isArray(data.sections) ? data.enrollment.totalEnrolled / data.sections.length : 0,
    //classSize: didLoadCorrectly ? data.enrollment.totalEnrolled / sectionData.filter(sec => getTotalEnrolled(sec) > 0).length : 0,
    classSize,
    //sectionLoadingProgress: didLoadCorrectly ? Array.isArray(data.sections) ? (sectionLoadingProgress/data.sections.length*100) : 0 : 0,
    sectionLoadingProgress: 100,
    rmpHref: didLoadCorrectly && data.rmpLegacyId !== undefined ? getRMPProfessorViewableUrl(data.rmpLegacyId) : undefined,
  }
}
