import { Course, Enrollment, EstimateClassSize, formatTermCode, GetEnrolledCountByCourse, GetTotalEnrolled, Group, Instructor, IsDocumentReferenceArray, Section, ToDocumentReference } from '@cougargrades/models';
import { course2CoursePlus, course2Result, EnrollmentInfoResult, generateSubjectString, getBadges, getSeasonalAvailability, Grade, grade2Color, group2Result, InstructorResult, InstructorTopCourseEntry } from '@cougargrades/models/dto';
import { defaultComparator, descendingComparator } from '@cougargrades/utils/comparator'
import { isNullish } from '@cougargrades/utils/nullish'
import { getRMPProfessorViewableUrl } from '@cougargrades/vendor/rmp'

import { getFirestoreDocuments, getFirestoreDocumentSafe } from './firestore-config';
import { getChartDataForInstructor } from './getChartDataForInstructor';


export async function getInstructorResults(instructorName: string): Promise<InstructorResult | null> {
  const { data } = await getFirestoreDocumentSafe(`instructors/${instructorName.toLowerCase()}`, Instructor)
  if (isNullish(data)) return null;
  const didLoadCorrectly = data !== undefined && typeof data === 'object' && Object.keys(data).length > 1  
  const groupRefs = Object.entries(data?.departments ?? {})
    .sort((a, b) => b[1] - a[1])
    .map(kvp => kvp[0])
    .map(abbr => ToDocumentReference(`groups/${abbr}`))

  const settledData = await Promise.allSettled([
    (data && Array.isArray(data.courses) && IsDocumentReferenceArray(data.courses) ? getFirestoreDocuments(data.courses, Course) : Promise.resolve<Course[]>([])),
    (data && Array.isArray(data.sections) && IsDocumentReferenceArray(data.sections) ? getFirestoreDocuments(data.sections, Section) : Promise.resolve<Section[]>([])),
    (data && Array.isArray(groupRefs) && IsDocumentReferenceArray(groupRefs) ? getFirestoreDocuments(groupRefs, Group) : Promise.resolve<Group[]>([])),
  ]);

  const [courseDataSettled, sectionDataSettled, groupDataSettled] = settledData;
  const courseData = courseDataSettled.status === 'fulfilled' ? courseDataSettled.value : [];
  const sectionData = sectionDataSettled.status === 'fulfilled' ? sectionDataSettled.value : [];
  const groupData = groupDataSettled.status === 'fulfilled' ? groupDataSettled.value : [];

  const classSize = didLoadCorrectly ? EstimateClassSize(data.enrollment, sectionData) : 0

  return {
    meta: {
      _id: data?._id ?? '',
      firstName: data?.firstName ?? '',
      lastName: data?.lastName ?? '',
      fullName: data?.fullName ?? '',
      // 70 characters is also the default, but if we decide to change that later it shouldn't impact this
      descriptionDepartmentsInvolved: generateSubjectString(data, 70),
    },
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
            tooltip: data.enrollment[k] !== undefined && data.enrollment.totalEnrolled !== 0 ? `${data.enrollment[k].toLocaleString()} total students have received ${k.substring(5)}s` : undefined,
          })
      ) : []),
    ],
    firstTaught: didLoadCorrectly ? formatTermCode(data.firstTaught) : '',
    lastTaught: didLoadCorrectly ? formatTermCode(data.lastTaught) : '',    
    relatedGroups: groupData
      .map(e => group2Result(e)),
    relatedCourses: courseData
      .sort((a,b) => b.enrollment.totalEnrolled - a.enrollment.totalEnrolled)
      .map(e => course2Result(e)),
    sectionDataGrid: {
      // columns: [
      //   /**
      //    * I don't think these columns matter on the back-end because functions can't be serialized anyway
      //    */
      // ],
      rows: [
        ...(didLoadCorrectly ? sectionData.sort((a,b) => b.term - a.term).map(e => ({
          ...e,
          id: e._id,
          primaryInstructorName: Array.isArray(e.instructorNames) ? `${e.instructorNames[0].lastName}, ${e.instructorNames[0].firstName}` : '',
          instructors: [],
          totalEnrolled: GetTotalEnrolled(e),
        })) : [])
      ],
    },
    courseDataGrid: {
      // columns: [
      //   /**
      //    * I don't think these columns matter on the back-end because functions can't be serialized anyway
      //    */
      // ],
      rows: [
        ...(courseData.sort((a,b) => b._id.localeCompare(a._id)).map(e => course2CoursePlus(e)))
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
    enrollmentSparklineData: data?.enrollmentSparklineData ?? undefined,
    courseCount: didLoadCorrectly ? Array.isArray(data.courses) ? data.courses.length : 0 : 0,
    sectionCount: didLoadCorrectly ? Array.isArray(data.sections) ? data.sections.length : 0 : 0,
    //classSize: didLoadCorrectly && Array.isArray(data.sections) ? data.enrollment.totalEnrolled / data.sections.length : 0,
    //classSize: didLoadCorrectly ? data.enrollment.totalEnrolled / sectionData.filter(sec => getTotalEnrolled(sec) > 0).length : 0,
    classSize,
    //sectionLoadingProgress: didLoadCorrectly ? Array.isArray(data.sections) ? (sectionLoadingProgress/data.sections.length*100) : 0 : 0,
    sectionLoadingProgress: 100,
    rmpHref: didLoadCorrectly && !isNullish(data.rmpLegacyId) ? getRMPProfessorViewableUrl(data.rmpLegacyId) : undefined,
    topCourses: Array.from(GetEnrolledCountByCourse(sectionData).entries())
      .toSorted((a,b) => defaultComparator(a[1], b[1]))
      .map<InstructorTopCourseEntry>(([courseName, totalEnrolled]) => ({
        courseName,
        totalEnrolled,
      })),
  }
}
