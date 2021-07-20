import { isEmpty, isVowel, unwrap } from './helper'

export const en_US = {
  "hello": "Hello",
  "meta": {
    "course": {
      "description": ({ courseName, description }) => isEmpty(courseName) ? 'A course at the University of Houston. View grade distribution data at CougarGrades.io.' : `${courseName} ${! isEmpty(description) ? `(${description}) ` : ''}is a course at the University of Houston. View grade distribution data at CougarGrades.io.`
    },
    "instructor": {
      "description": ({instructorName, departmentText}) => isEmpty(instructorName) ? `An instructor at the University of Houston. View grade distribution data at CougarGrades.io.` : `${instructorName} is ${isEmpty(departmentText) || isVowel(departmentText) ? 'an ' : 'a ' }${`${unwrap(departmentText)} `}instructor at the University of Houston. View grade distribution data at CougarGrades.io.`
    }
  },
  "season": {
    "01": "Spring",
    "02": "Summer",
    "03": "Fall"
  }
}
