import { isEmpty } from './helper'

export const es = {
  "hello": "Hola",
  "meta": {
    "course": {
      "description": ({ courseName, description }) => isEmpty(courseName) ? 'Un curso en la Universidad de Houston. Vea los datos de distribución de calificaciones en CougarGrades.io.' : `${courseName} ${! isEmpty(description) ? `(${description}) ` : ''}es un curso de la Universidad de Houston. Vea los datos de distribución de calificaciones en CougarGrades.io.`
    },
    "instructor": {
      "description": ({instructorName, departmentText}) => isEmpty(instructorName) ? `Instructora de la Universidad de Houston. Vea los datos de distribución de calificaciones en CougarGrades.io.` : `${instructorName} es instructor ${departmentText !== '' ? `de ${departmentText} ` : ''}en la Universidad de Houston. Vea los datos de distribución de calificaciones en CougarGrades.io.`
    }
  },
  "season": {
    "01": "Primavera",
    "02": "Verano",
    "03": "Otoño"
  }
}