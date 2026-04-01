
import { z } from 'zod'

export type TermInfo = z.infer<typeof TermInfo>
export const TermInfo = z.object({
  /**
   * This is the unique identifier for a "term" (Semester) that UH keeps in PeopleSoft, so it may be represented in other services as well.
   * 
   * There is a pattern in that the ID is usually a multiple of 10, but other than that consider it a database primary key. There is no meaningful pattern.
   * 
   * @example "2130" "2030"
   */
  term: z.string(),
  /**
   * This is the human-readable string that represents what time period this "term" covers
   * 
   * @example "Spring 2021" "Fall 2017"
   */
  term_descr: z.string(),
})

export type SubjectInfo = z.infer<typeof SubjectInfo>
export const SubjectInfo = z.object({
  /**
   * This is the abbreviation of a subject
   * 
   * @example "ENGL" "GEOL"
   */
  subject: z.string()
})

export type EInstructionMode = z.infer<typeof EInstructionMode>
export const EInstructionMode = z.enum([
  'Face-to-Face',
  'Synchronous Online',
  'Hybrid',
  'Asynchronous Online',
  'Hyflex',
  'Directed Research',
  'Synchronous - On Campus Exams',
  'Independent Studies',
  'Asynchronous - On Campus Exams',
  'Face to Face',
  'Hyflex - On Campus Exams'
])

export type InstructionModeInfo = z.infer<typeof InstructionModeInfo>
export const InstructionModeInfo = z.object({
  /**
   * This is the abbreviation of a subject
   * 
   * @example "ENGL" "GEOL"
   */
  mode: z.union([z.string(), EInstructionMode]),
})

export type InstructorInfo = z.infer<typeof InstructorInfo>
export const InstructorInfo = z.object({
  /**
   * The instructor's name
   * @example "Buzzanco,Robert"
   */
  instr: z.string(),
})

export type CourseInfo = z.infer<typeof CourseInfo>
export const CourseInfo = z.object({
  /** @example "1117" */
  catalog_nbr: z.string(),
  /** @example "MUSI" */
  subject: z.string(),
})

export type ECareer = z.infer<typeof ECareer>
/**
 * `UGRD` => Undergraduate
 * 
 * `GRAD` => Graduate
 * 
 * `LAW` => Law
 * 
 * `OPT` => Optometry
 * 
 * `PHRM` => Pharmacy
 * 
 * `MED` => Medical
 */
export const ECareer = z.enum([
  'UGRD',
  'GRAD',
  'LAW',
  'OPT',
  'PHRM',
  'MED'
]);

/**
 * Human visible descriptions for each member of `ECareer`
 */
export const ECareerDescription: Record<ECareer, string> = {
  'UGRD': 'Undergraduate',
  'GRAD': 'Graduate',
  'LAW': 'Law',
  'OPT': 'Optometry',
  'PHRM': 'Pharmacy',
  'MED': 'Medical'
}

export type EClassTime = z.infer<typeof EClassTime>
export const EClassTime = z.enum([
  'morning',
  'afternoon',
  'evening'
])

/**
 * Human visible descriptions for each member of `EClassTime`
 */
export const EClassTimeDescription: Record<EClassTime, string> = {
  'morning': 'Morning - 8:00 am - 11:30 am',
  'afternoon': 'Afternoon - 12:00 pm - 5:30 pm',
  'evening': 'Evening - 6:00 pm - 11:30 pm',
}

export type ECoreComponent = z.infer<typeof ECoreComponent>
const _ECoreComponent = [10, 20, 30, 40, 50, 60, 70, 80, 81, 90] as const;
export const ECoreComponent = z.union(_ECoreComponent.map(v => z.literal(v))); //z.enum()

/**
 * Human visible descriptions for each member of `ECoreComponent`
 */
export const ECoreComponentDescription = new Map<ECoreComponent, string>([
  [10, 'Communication'],
  [20, 'Mathematics'],
  [30, 'Life & Physical Sciences'],
  [40, 'Language, Philosophy & Culture'],
  [50, 'Creative Arts'],
  [60, 'American History'],
  [70, 'Government/Political Science'],
  [80, 'Social & Behavioral Science'],
  [81, 'Writing in Discipline WID'],
  [90, 'Math/Reasoning, Component Area Option'],
]);

export type EDayOfWeek = z.infer<typeof EDayOfWeek>
export const EDayOfWeek = z.enum(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'])

/**
 * Human visible descriptions for each member of `EDayOfWeek`
 */
export const EDayOfWeekDescription: Record<EDayOfWeek, string> = {
  'Mo': 'Monday',
  'Tu': 'Tuesday',
  'We': 'Wednesday',
  'Th': 'Thursday',
  'Fr': 'Friday',
  'Sa': 'Saturday'
}

export type ELocation = z.infer<typeof ELocation>
export const ELocation = z.enum(['University of Houston', 'Katy Academic Building 1', 'UH-Sugar Land'])

export type IntBool = z.infer<typeof IntBool>
export const IntBool = z.union([z.literal(0), z.literal(1)])

export type YesNo = z.infer<typeof YesNo>
export const YesNo = z.union([z.literal('Y'), z.literal('N')])

export type ESsrComponent = z.infer<typeof ESsrComponent>
export const ESsrComponent = z.enum([
  'LEC',
  'LAB',
  'SEM',
  'IND',
  'PRA',
  'PRC',
  'CLN',
  'DST',
  'THE',
  'PCO',
  'PLS',
]);

/**
 * `A` => Active
 * 
 * `S` => Stop Enrollment
 */
export type EClassState = z.infer<typeof EClassState>
export const EClassState = z.enum(['A', 'S']);   // Active | Stop Enrollment

/**
 * `O` => Open
 * 
 * `C` => Closed
 */
export type EEnrollmentState = z.infer<typeof EEnrollmentState>
export const EEnrollmentState  = z.enum(['O', 'C']);   // Open   | Closed

/**
 * `E` => Enrollment
 * 
 * `N` => Non-enrollment
 */
export type EClassType = z.infer<typeof EClassType>
export const EClassType = z.enum(['E', 'N']);   // Enrollment | Non-enrollment


export type LocalDateTime = z.infer<typeof LocalDateTime>
export const LocalDateTime = z.templateLiteral([z.iso.date(), " ", z.iso.time() ])

export type LiveSectionResult = z.infer<typeof LiveSectionResult>
export const LiveSectionResult = z.object({
  /**
   * Globally unique ID for this specific section
   * 
   * @example 228010055
   */
  id: z.number(),
  /**
   * The Institution ID where this section is taught
   * 
   * @example "00730"
   */
  institution: z.string(),
  /**
   * The ID of the "term" when this section is taught
   * 
   * @example "2280"
   */
  term: z.string(),
  /**
   * @example "1"
   */
  session_code: z.string(),
  /**
   * @example "H460MCL"
   */
  academic_org: z.string(),
  /**
   * @example "H0001"
   */
  location_code: z.string(),
  /**
   * @example "University of Houston", see common values in `ELocation`
   */
  location_descr: z.union([z.string(), ELocation]),
  /**
   * @example "FF"
   */
  instr_mode: z.string(),
  /**
   * @example "Face-to-Face", see common values in `EInstructionMode`
   */
  instr_mode_descr: z.union([z.string(), EInstructionMode]),
  session_start_date: z.iso.date(),
  session_end_date: z.iso.date(),
  /**
   * @example "ACCT"
   */
  subject: z.string(),
  /**
   * @example "6331"
   */
  catalog_nbr: z.string(),
  /**
   * @example "10055"
   */
  class_nbr: z.string(),
  /**
   * @example "01"
   */
  class_section: z.string(),
  career: ECareer,
  /**
   * Not sure what this means
   * @example 3
   */
  assoc_class: z.number(),
  /**
   * @example "Financial Accounting"
   */
  course_title: z.string(),
  /**
   * @example "Cr. 3. (3-0). Prerequisites: graduate standing. Introduction to transaction analysis, recording, preparation, and understanding of basic financial statements."
   */
  course_long_descr: z.string().nullable(),
  course_topic_descr: z.string().nullable(),
  topic_id: z.number(),
  /**
   * unknown
   */
  combined_section: z.string().nullable(),
  ssr_component: ESsrComponent,
  class_type: EClassType,
  schedule_print: YesNo,
  /**
   * Uniquely identifies this course
   */
  course_id: z.string(),
  course_offer_nbr: z.number(),
  /**
   * @example "Mo 06:00 PM-09:00 PM"
   */
  schedule_day_time: z.string().nullable(),
  class_start: z.iso.time(),
  class_end:  z.iso.time(),
  /** @example "MH 114" */
  building_descr: z.string().nullable(),
  class_stat: EClassState,
  enrl_stat: EEnrollmentState,
  /**
   * The number currently enrolled.
   * @example 23
   */
  enrl_tot: z.number(),
  /**
   * The number of seats available
   * @example 66
   */
  enrl_cap: z.number(),
  /** @example "1225084" */
  instructor_id: z.string().nullable(),
  /** @example "Zhu,Limin" */
  instructor_name: z.string().nullable(),
  /**
   * Presumably, when the API request was made.
   * @example "2026-03-14"
   */
  capture_date: z.iso.date(),
  has_syllabus: IntBool,
  is_offcampus: IntBool,
  is_extension: IntBool,
  is_weekendu: IntBool,
  is_core_curriculum: IntBool,
  is_blackboard: IntBool,
  created_at: LocalDateTime,
  updated_at: LocalDateTime,
  session: z.object({
    id: z.number(),
    institution: z.string(),
    career: ECareer,
    term: z.string(),
    session_code: z.string(),
    instr_weeks: z.number(),
    /** @example "2026-01-20" */
    session_start_date: z.iso.date(),
    /** @example "2026-05-12" */
    session_end_date: z.iso.date(),
    /** @example "2026-02-04" */
    session_census_date: z.iso.date(),
    /** @example "2026-04-01" */
    sixty_pct_date: z.iso.date(),
    use_dynamic_class_date: YesNo,
    created_at: LocalDateTime,
    updated_at: LocalDateTime,
  }).nullable(),
  note: z.unknown().array(),
})


export type LiveSectionFilters = z.infer<typeof LiveSectionFilters>
export const LiveSectionFilters = z.object({
  /**
   * term id
   * @example "2280"
   */
  term: z.string(),
  subject: z.string(),
  //location:
  limitToLocation: ELocation,
  mode: EInstructionMode,
  coreComp: ECoreComponent,
  classNumber: z.string(),
  catalogNumber: z.string(),
  classStatus: z.union([z.literal('open'), z.literal('false')]),
  /** @example "Buzzanco,Robert" */
  instructor: z.string(),
  classTime: EClassTime,
  day: EDayOfWeek,
})

export type LiveSectionResponse = z.infer<typeof LiveSectionResponse>
export const LiveSectionResponse = z.object({
  current_page: z.number(),
  data: LiveSectionResult.array(),
  first_page_url: z.url().nullable(),
  from: z.number().nullable(),
  last_page: z.number(),
  last_page_url: z.url().nullable(),
  next_page_url: z.url().nullable(),
  path: z.url().nullable(),
  per_page: z.number(),
  prev_page_url: z.url().nullable(),
  to: z.number().nullable(),
  total: z.number()
})
