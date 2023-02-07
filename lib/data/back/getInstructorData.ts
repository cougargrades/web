import { Course, Enrollment, Group, Instructor, Section, Util } from '@cougargrades/types'
import { firebase } from '../../firebase_admin'
import { getFirestoreDocument } from '../../data/back/getFirestoreData'
import { InstructorResult } from '../useInstructorData';
import { getRosetta } from '../../i18n';
import { getBadges } from '../getBadges';
import { Grade, grade2Color } from '../../../components/badge';
import { getTotalEnrolled, getYear, seasonCode } from '../../util';
import { group2Result, SectionPlus } from '../useCourseData';
import { course2Result } from '../useAllGroups';
import { Column } from '../../../components/datatable';
import { getChartDataForInstructor } from '../getChartDataForInstructor';

/**
 * Used server-side
 */
export async function getInstructorData(instructorName: string): Promise<InstructorResult> {
  const stone = getRosetta()
  const db = firebase.firestore();
  const data = await getFirestoreDocument<Instructor>(`/instructors/${instructorName}`)
  const didLoadCorrectly = data !== undefined && typeof data === 'object' && Object.keys(data).length > 1
  const groupRefs = ! didLoadCorrectly ? [] : Object
    .entries(data.departments)
    .sort((a, b) => b[1] - a[1])
    .map(e => e[0])
    .map(e => db.doc(`/groups/${e}`) as FirebaseFirestore.DocumentReference<Group>);

  const settledData = await Promise.allSettled([
    (data && Array.isArray(data.courses) && Util.isDocumentReferenceArray(data.courses) ? Util.populate<Course>(data.courses) : Promise.resolve<Course[]>([])),
    (data && Array.isArray(data?.sections) && Util.isDocumentReferenceArray(data.sections) ? Util.populate<Section>(data.sections, 10, true) : Promise.resolve<Section[]>([])),
    (data && Array.isArray(groupRefs) && Util.isDocumentReferenceArray(groupRefs) ? Util.populate<Group>(groupRefs) : Promise.resolve<Group[]>([])),
  ]);

  const [courseDataSettled, sectionDataSettled, groupDataSettled] = settledData;
  const courseData = courseDataSettled.status === 'fulfilled' ? courseDataSettled.value : [];
  const sectionData = sectionDataSettled.status === 'fulfilled' ? sectionDataSettled.value : [];
  const groupData = groupDataSettled.status === 'fulfilled' ? groupDataSettled.value : [];

  return {
    badges: [
      ...(didLoadCorrectly ? getBadges(data.GPA, data.enrollment) : []),
    ],
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
        {
          field: 'term',
          headerName: 'Term',
          type: 'number',
          width: 65,
          //valueFormatter: value => `${stone.t(`season.${seasonCode(value)}`)} ${getYear(value)}`,
        },
        {
          field: 'courseName',
          headerName: 'Course',
          type: 'string',
          width: 75,
          padding: 8,
          // eslint-disable-next-line react/display-name
          //valueFormatter: value => <Link href={`/c/${encodeURI(value)}`}><a>{value}</a></Link>,
        },
        {
          field: 'sectionNumber',
          headerName: 'Section #',
          type: 'number',
          width: 90,
        },
        ...(['A','B','C','D','F','W','S','NCR']).map<Column<SectionPlus>>(e => ({
          field: e as any,
          headerName: e,
          description: `Number of ${e}s given for this section`,
          type: 'number',
          width: e !== 'NCR' ? 30 : 60,
          padding: 6,
        })),
        {
          field: 'semesterGPA',
          headerName: 'GPA',
          description: 'Grade Point Average for just this section',
          type: 'number',
          width: 60,
          padding: 8,
        } as any,
      ],
      rows: [
        ...(didLoadCorrectly ? sectionData.sort((a,b) => b.term - a.term).map(e => ({
          ...e,
          id: e._id,
          primaryInstructorName: Array.isArray(e.instructorNames) ? `${e.instructorNames[0].lastName}, ${e.instructorNames[0].firstName}` : '',
          instructors: [],
        })) : [])
      ],
    },
    courseDataGrid: {
      columns: [
        {
          field: 'id',
          headerName: 'Name',
          type: 'string',
          width: 65,
          padding: 8,
          // eslint-disable-next-line react/display-name
          //valueFormatter: value => <Link href={`/c/${encodeURI(value)}`}><a>{value}</a></Link>,
        },
        {
          field: 'description',
          headerName: 'Description',
          type: 'string',
          width: 105,
          padding: 8,
        },
        {
          field: 'firstTaught',
          headerName: 'First Taught',
          description: 'The oldest semester that this course was taught',
          type: 'number',
          width: 75,
          padding: 6,
          //valueFormatter: value => `${stone.t(`season.${seasonCode(value)}`)} ${getYear(value)}`,
        },
        {
          field: 'lastTaught',
          headerName: 'Last Taught',
          description: 'The most recent semester that this course was taught',
          type: 'number',
          width: 75,
          padding: 6,
          //valueFormatter: value => `${stone.t(`season.${seasonCode(value)}`)} ${getYear(value)}`,
        },
        {
          field: 'instructorCount',
          headerName: '# Instructors',
          description: 'Number of instructors',
          type: 'number',
          width: 110,
          padding: 4,
          //valueFormatter: value => value.toLocaleString(),
        },
        {
          field: 'sectionCount',
          headerName: '# Sections',
          description: 'Number of sections',
          type: 'number',
          width: 95,
          padding: 8,
          //valueFormatter: value => value.toLocaleString(),
        },
        {
          field: 'totalEnrolled',
          headerName: '# Enrolled',
          description: 'Total number of students who have been enrolled in this course',
          type: 'number',
          width: 95,
          padding: 8,
          //valueFormatter: value => isNaN(value) ? 'No data' : value.toLocaleString(),
        },
        {
          field: 'enrolledPerSection',
          headerName: 'Class Size',
          description: 'Estimated average size of each section, # of total enrolled ÷ # of sections',
          type: 'number',
          width: 80,
          padding: 6,
          //valueFormatter: value => isNaN(value) ? 'No data' : `~ ${value.toFixed(1)}`,
        },
        {
          field: 'gradePointAverage',
          headerName: 'GPA',
          description: 'Average of Grade Point Average',
          type: 'number',
          width: 60,
          padding: 8,
          // eslint-disable-next-line react/display-name
          //valueFormatter: value => value !== 0 ? <Badge style={{ backgroundColor: grade2Color.get(getGradeForGPA(value)) }}>{formatGPAValue(value)}</Badge> : '',
        },
        {
          field: 'standardDeviation',
          headerName: 'SD',
          description: 'Standard deviation of GPA across all sections in a course',
          type: 'number',
          width: 60,
          padding: 8,
          // eslint-disable-next-line react/display-name
          //valueFormatter: value => value !== 0 ? <Badge style={{ backgroundColor: grade2Color.get(getGradeForStdDev(value)) }}>{formatSDValue(value)}</Badge> : '',
        },
        {
          field: 'dropRate',
          headerName: '% W',
          description: 'Drop rate, # of total Ws ÷ # of total enrolled',
          type: 'number',
          width: 60,
          padding: 8,
          // eslint-disable-next-line react/display-name
          //valueFormatter: value => isNaN(value) ? 'No data' : <Badge style={{ backgroundColor: grade2Color.get('W') }}>{formatDropRateValue(value)}</Badge>,
        },
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
          enrolledPerSection: e.enrollment !== undefined && Array.isArray(e.sections) ? (e.enrollment.totalEnrolled / e.sections.length) : NaN,
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
    courseCount: didLoadCorrectly ? Array.isArray(data.courses) ? data.courses.length : 0 : 0,
    sectionCount: didLoadCorrectly ? Array.isArray(data.sections) ? data.sections.length : 0 : 0,
    //classSize: didLoadCorrectly && Array.isArray(data.sections) ? data.enrollment.totalEnrolled / data.sections.length : 0,
    classSize: didLoadCorrectly ? data.enrollment.totalEnrolled / sectionData.filter(sec => getTotalEnrolled(sec) > 0).length : 0,
    //sectionLoadingProgress: didLoadCorrectly ? Array.isArray(data.sections) ? (sectionLoadingProgress/data.sections.length*100) : 0 : 0,
    sectionLoadingProgress: 100,
    rmpHref: didLoadCorrectly && data.rmpLegacyId !== undefined ? `https://www.ratemyprofessors.com/ShowRatings.jsp?tid=${data.rmpLegacyId}` : undefined,
  }
}
