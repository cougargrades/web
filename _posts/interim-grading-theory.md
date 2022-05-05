---
title: 'Sometimes the "GPA" column is inconsistent with the letter grades that the students actually received. What does this mean? What should I believe?'
date: '2022-05-05T00:50:57.786Z'
id: 4
---

## Sometimes the "GPA" column is inconsistent with the letter grades that the students actually received. What does this mean? What should I believe?

This is a very clever observation, and there's supposedly a rational explanation for this.
Generally speaking, the data we receive from UH looks like this:

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
        <td>Spring 2021</td>
        <td>POLS</td>
        <td>6312</td>
        <td>...</td>
        <td>2</td>
        <td>4</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>4</td>
        <td>1</td>
        <td>3.498</td>
      </tr>
      <tr>
        <td>Spring 2021</td>
        <td>MATH</td>
        <td>3321</td>
        <td>...</td>
        <td>66</td>
        <td>41</td>
        <td>4</td>
        <td>0</td>
        <td>0</td>
        <td>46</td>
        <td>2</td>
        <td>6</td>
        <td>2.026</td>
      </tr>
      <tr>
        <td>Spring 2021</td>
        <td>COMM</td>
        <td>4303</td>
        <td>...</td>
        <td>3</td>
        <td>7</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>18</td>
        <td>2</td>
        <td>3</td>
        <td>0.971</td>
      </tr>
    </tbody>
  </table>
</div>

The "AVG GPA" column is what CougarGrades uses in its statistics. By design, we do not recompute this value based on the number of letter grades received.

You can very obviously see that the bottom 2 rows don't have "AVG GPA" columns that make sense. However, this data is *exactly* as UH provided it (with no official explanation). What gives?

From this, we can infer that: <ins>The GPA that UH provides is not necessarily the GPA that could be calculated from the grade letters received</ins>.
The leading theory we've <em><abbr title="speculate (verb): form a theory or conjecture about a subject without firm evidence.">speculated</abbr></em> from this is:

The GPA that UH provides is the "real" GPA that isn't affected by "S" and "NCR" grades. In other words, it's the average GPA of what the students *would have* made if they didn't receive S or NCR grades, and accounts for all the Cs, Ds, and Fs that would've been given in the course.

With this in mind, it makes a lot of the lower "AVG GPA" values seem pretty bleak, although this is most likely attributed due to the COVID-19 global pandemic and the abrupt transition to online classes.

