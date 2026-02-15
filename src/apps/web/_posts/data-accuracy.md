---
title: 'Is all the grade data accurate?'
date: '2023-02-26T09:05:02.167Z'
id: 3
---

## Is all the grade data accurate?

All grade data on CougarGrades is directly from UH and is 100% authentic.

However...

The grade data provided directly by UH can sometimes have some holes, or missing data, in it.
Sometimes these holes aren't just areas where a number is left blank, but instead left with a 0 instead,
when a zero doesn't make sense in context. For example, a section may be included, but for all letter grades 0 is 
listed (0 As were given, 0 Bs were given, etc). **This is especially evident for instructors 
who teach Graduate courses instead of Undergraduate courses**.

<s rel="outdated">Whenever we process the grade data, we ignore areas where UH leaves missing data in the calculations.
Unfortunately, for the case where a 0 is left where it shouldn't be, there's nothing we can do
but include it in the data result, because that 0 could actually be true.</s>

### Update (Feb 26, 2023):

To help more accurately represent the GPA for a Course or Instructor, in order for a row/section to be included in the calculation for GPA, it must satisfy these properties:

- `AVG_GPA` must *not* be empty
- `AVG_GPA` must *not* be zero (0)
  - This is assumed to be inaccurate or an error as a result of a course being ungraded or Pass/Fail, such as with Graduate Level courses.
- The "Total Enrolled" in a section (number of A+B+C+D+F+W+S+U+NCR given) must be more than zero.

#### Examples of sections NOT factored in the GPA

<div rel="table-wrap">
  <table>
    <thead>
      <tr>
        <th>TERM</th>
        <th>SUBJECT</th>
        <th>CATALOG NBR</th>
        <th>...</th>
        <th>A</th>
        <th>B</th>
        <th>C</th>
        <th>D</th>
        <th>F</th>
        <th>SATISFACTORY</th>
        <th>NOT REPORTED</th>
        <th>TOTAL DROPPED</th>
        <th>AVG GPA</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Spring 2022</td>
        <td>PCOL</td>
        <td>6198</td>
        <td>...</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>1</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
      </tr>
      <tr>
        <td>Fall 2017</td>
        <td>ECE</td>
        <td>4117</td>
        <td>...</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td></td>
      </tr>
      <tr>
        <td>Fall 2017</td>
        <td>POLS</td>
        <td>6356</td>
        <td>...</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0.197</td>
      </tr>
    </tbody>
  </table>
</div>

This change was [discussed on GitHub](https://github.com/cougargrades/web/issues/115) and rolled out in the 1.1.0 update to CougarGrades.
