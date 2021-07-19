import { isEmpty, isVowel, unwrap } from './helper'

export const en_US = {
  "hello": "Hello",
  "meta": {
    "instructor": {
      "description": ({instructorName, departmentText}) => `${instructorName} is ${isEmpty(departmentText) || isVowel(departmentText) ? 'an ' : 'a ' }${unwrap(departmentText)} instructor at the University of Houston. View grade distribution data at CougarGrades.io.`
    }
  }
}
