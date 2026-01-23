import { Section } from '@cougargrades/types'

/**
 * Very much extracted from PoC3
 * https://github.com/cougargrades/web/blob/3d511fc56b0a90f2038883a71852245b726af7e3/src/components/courses/results/Processor.js#L177
 */
export function getChartData(sections: Section[]) {
  let expanded = expandSections(sections);
  // Sorts results chronologically
  expanded.sort((a,b) => a['term'] - b['term'])

  //make column headings for chart
  //ensure each prof only appears once in columns
  let cols = Array.from(new Set(['Semester', ...expanded.map(e => e.primaryInstructorFullName)]))

  let graphArray = []
  graphArray.push(cols)

  let colsMap = new Map<string, number>()
  for(let i = 0; i < cols.length; ++i) {
      colsMap.set(cols[i], i); //map prof name to column index
  }

  let rowsMap = new Map(); //map semester to row in chart data
  let studentsMap = new Map(); //map semester + prof to number of students taught by that prof in that semester
  for(let i = 0; i < expanded.length; ++i) { //add GPAs to chart data
      if(expanded[i]['semesterGPA'] === null) { //skip secions with no GPA
          continue;
      }
      let gpa = expanded[i]['semesterGPA'];
      let students = (expanded[i]['A'] ?? 0)
          + (expanded[i]['B'] ?? 0)
          + (expanded[i]['C'] ?? 0)
          + (expanded[i]['D'] ?? 0)
          + (expanded[i]['F'] ?? 0);
      let instructor = expanded[i]['primaryInstructorFullName'];
      let rowID = graphArray.length;
      let term = expanded[i]['termString'].split(' ').reverse().join(' '); // "Fall 2013" => "2013 Fall"
      
      if(typeof studentsMap.get(`${term} ${instructor}`) === 'undefined') { //if first section prof has taught this semester
          studentsMap.set(`${term} ${instructor}`, students) //set number of students in section
      }
      else {
          studentsMap.set(`${term} ${instructor}`,
              studentsMap.get(`${term} ${instructor}`) + students) //increment number of students taught this semester
      }
      if(typeof rowsMap.get(term) === 'undefined') { //if row for semester doesn't exist in chart data
          //initialize row
          rowsMap.set(term, rowID);
          let newRow = new Array(cols.length);
          newRow[0] = (term);
          graphArray.push(newRow);
      }
      else {
          rowID = rowsMap.get(term);
      }
      if(typeof graphArray[rowID][colsMap.get(instructor)!] === 'undefined') { //initialize cell
          graphArray[rowID][colsMap.get(instructor)!] = 0;
      }
      // TODO: fix? null * number => 0
      //graphArray[rowID][colsMap.get(instructor)!] += gpa*students; //increment student-weighted GPA
      graphArray[rowID][colsMap.get(instructor)!] += (gpa ?? 0)*students; //increment student-weighted GPA
  }
  for(let i = 1; i < graphArray.length; ++i) {
      for(let j = 1; j < graphArray[i].length; ++j) {
          if(typeof graphArray[i][j] !== 'undefined') {
              graphArray[i][j] /= studentsMap.get(`${graphArray[i][0]} ${graphArray[0][j]}`) //student-weighted average GPAs
              graphArray[i][j] = parseFloat(graphArray[i][j].toFixed(3)) //round to 3 (for cleanliness in tooltip)
          }
      }
  }

  // include the "type" in the header row, fixes #7 and #32
  // see: https://stackoverflow.com/a/48722007
  for(let j = 1; j < graphArray[0].length; j++) {
      graphArray[0][j] = { label: graphArray[0][j], type: 'number' };
  }
  // return a deepcopy of graphArray
  return JSON.parse(JSON.stringify(graphArray));
}

/**
 * Very much extracted from PoC3
 * https://github.com/cougargrades/web/blob/3d511fc56b0a90f2038883a71852245b726af7e3/src/components/courses/results/Course.js#L54
 */
export function expandSections(sections: Section[]) {
  // remove instructors property
  let product = sections.map(({ instructors, ...o }) => ({
    primaryInstructor: {
      firstName: '',
      lastName: '',
    },
    primaryInstructorFullName: '',
    primaryInstructorFirstName: '',
    primaryInstructorLastName: '',
    // primaryInstructorTermGPA: '',
    // primaryInstructorTermGPAmax: '',
    // primaryInstructorTermGPAmin: '',
    // primaryInstructorTermSectionsTaught: '',
    ...o
  }));
  // expands sections
  for(let item of product) {
    // if a course with the same term and sectionNumber has > 1 occurrences
    if(Array.isArray(item.instructorNames) && item.instructorNames.length > 1) {
      // create a clone of this Course
      let clone = JSON.parse(JSON.stringify(item)) as typeof item;
      // no functional difference, just satisfies typescript 
      if(Array.isArray(clone.instructorNames)) {
        clone.instructorNames = clone.instructorNames.slice(1);
        product.push(clone);
      }
    }
    // move instructor data to `primaryInstructor`
    //item.primaryInstructor = item.instructorNames[0]
    item.primaryInstructor = Array.isArray(item.instructorNames) ? item.instructorNames[0] : { firstName: '???', lastName: '???' };
    //delete item.instructorNames;
  }

  // expands instructor data
  for(let item of product) {
      item.primaryInstructorFullName = `${item.primaryInstructor.lastName}, ${item.primaryInstructor.firstName}`;
      item.primaryInstructorFirstName = item.primaryInstructor.firstName;
      item.primaryInstructorLastName = item.primaryInstructor.lastName;
      // item.primaryInstructorTermGPA = item.primaryInstructor.termGPA;
      // item.primaryInstructorTermGPAmax = item.primaryInstructor.termGPAmax;
      // item.primaryInstructorTermGPAmin = item.primaryInstructor.termGPAmin;
      // item.primaryInstructorTermSectionsTaught = item.primaryInstructor.termSectionsTaught;
  }
  return product;
}