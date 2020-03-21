
/**]
 * @typedef {Object} Instructor
 * @property {String} firstName
 * @property {String} lastName
 * @property {Number} termGPA
 * @property {Number} termGPAmax
 * @property {Number} termGPAmin
 * @property {Number} termSectionsTaught
 */

/**
 * @typedef {Object} Course
 * @property {String} catalogNumber - Catalog number
 * @property {String} department - Department
 * @property {String} description - Course description
 * 
 * @property {Number} sectionNumber - Section number
 * @property {Number} semesterGPA - Semester GPA
 * @property {Number} term - Term code
 * @property {String} termString - Term string
 * @property {Instructor[]} instructorNames - Array of instructor names and contextual information
 * @property {Instructor} primaryInstructor - "Primary" instructor
 * @property {firebase.firestore.DocumentReference[]} instructors - Array of document references to instructors
 * 
 * @property {Number} A - Number of A's in this section
 * @property {Number} B - Number of B's in this section
 * @property {Number} C - Number of C's in this section
 * @property {Number} D - Number of D's in this section
 * @property {Number} F - Number of F's in this section
 * @property {Number} Q - Number of Q's in this section
 */

/**
 * Course
 */
export default class Course {
    /**
     * A processor class used to tabulate NoSQL data
     * @param {firebase.firestore.DocumentSnapshot} courseSnap - Document snapshot of the course
     * @param {firebase.firestore.QueryDocumentSnapshot} sectionsSnap - Collection snapshot of all the course's total sections
     */
    constructor(courseSnap, sectionSnap) {
        if(courseSnap.exists) {
            // Merge section data into course data, merge the compounded object into `this`
            Object.assign(this, Object.assign(courseSnap.data(), sectionSnap.data()));
        }
    }

    /**
     * Returns an expanded deep copy of courseArray which has indepdent sections for sections with multiple instructors
     * @param {Course} courseArray - An array of courses 
     */
    static expand(courseArray) {
        let t = courseArray.slice()
        t.forEach(item => { delete item.instructors })

        let product = JSON.parse(JSON.stringify(t))
        // expands sections
        for(let i = 0; i < product.length; i++) {
            // if a course with the same term and sectionNumber has > 1 occurrences
            if(product[i].instructorNames.length > 1) {
                // create a clone of this Course
                let clone = JSON.parse(JSON.stringify(product[i]));
                clone.instructorNames = clone.instructorNames.slice(1);
                product.push(clone);
            }
            // move instructor data to `primaryInstructor`
            product[i].primaryInstructor = product[i].instructorNames[0];
            delete product[i].instructorNames;
        }

        // expands instructor data
        for(let item of product) {
            item.primaryInstructorFullName = `${item.primaryInstructor.lastName}, ${item.primaryInstructor.firstName}`;
            item.primaryInstructorFirstName = item.primaryInstructor.firstName;
            item.primaryInstructorLastName = item.primaryInstructor.lastName;
            item.primaryInstructorTermGPA = item.primaryInstructor.termGPA;
            item.primaryInstructorTermGPAmax = item.primaryInstructor.termGPAmax;
            item.primaryInstructorTermGPAmin = item.primaryInstructor.termGPAmin;
            item.primaryInstructorTermSectionsTaught = item.primaryInstructor.termSectionsTaught;
        }
        return product;
    }
}
