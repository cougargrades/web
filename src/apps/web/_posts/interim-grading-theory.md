---
title: 'Sometimes the "GPA" column is inconsistent with the letter grades that the students actually received. What does this mean? What should I believe?'
date: '2024-01-08T04:40:57.424Z'
id: 4
---

## Sometimes the "GPA" column is inconsistent with the letter grades that the students actually received. What does this mean? What should I believe?

<details>
  <summary>Outdated answer from before January 7, 2024</summary>

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

</details>

### Update (January 7, 2024):

#### What happened?

For some sections held during the COVID-19 pandemic while the [Interim Undergraduate Grade Policy](https://uh.edu/provost/policies-resources/student/interim-undergraduate-grade-policy/) was still in effect, we've noticed that UH <ins>may have</ins> incorrectly calculated the GPA by including the number of S and NCR in their calculations.

For those who don't know, [UH claims to calculate GPA](https://publications.uh.edu/content.php?catoid=34&navoid=12493) by adding the number of points depending on the number of letter grades received by using the table below, then divides that sum by the number of students in that section that received a letter grade that was *not* one of: S, U, I, W, or NCR.

**For some semesters, we believe that UH may have accidentally included students that received S and NCR in their tally for the total number of students that received a grade, skewing the GPA down.**

A simplified GPA calculation could resemble the following formula:

```python
points = (4.0 * As + 3.0 * Bs + 2.0 * Cs + 1.0 * Ds + 0.0 * Fs)
# UH may have done this...
wrong_gpa = points / (studentsEnrolled - Us - Is - Ws)
# ...when they should've done this
correct_gpa = points / (studentsEnrolled - Us - Is - Ws - Ss - NCRs)
```

#### How is CougarGrades addressing this?

Using the number of letter grades received, and following the official GPA formula, we can re-calculate an estimate of the GPA ourselves.

With that estimate, if the recorded GPA and our estimate are different by over `0.25` ([the median standard deviation for all instructors](https://blog.cougargrades.io/2020/01/13/instructor-update/)), then we display a warning on the site:

![warning with estimated GPA](/gpa-estimate-warning.png)

We don't have the number of plus/minus (A+, B-, etc) grades within each category, so our estimate may be off.

<table align="center" border="1" cellpadding="2" cellspacing="0" style="height:316px; width:152px">
  <caption>Grade Points Awarded for Each Grade (<a href="https://publications.uh.edu/content.php?catoid=34&navoid=12493">Source</a>)</caption>
	<tbody>
		<tr>
			<td style="text-align:center; width:171px">
			<h5>Grade</h5>
			</td>
			<td style="text-align:center; width:933px">
			<h5>Points</h5>
			</td>
		</tr>
		<tr>
			<td style="text-align:center; width:171px">A</td>
			<td style="text-align:center; width:933px">4.00</td>
		</tr>
		<tr>
			<td style="text-align:center; width:171px">A-</td>
			<td style="text-align:center; width:933px">3.67</td>
		</tr>
		<tr>
			<td style="text-align:center; width:171px">B+</td>
			<td style="text-align:center; width:933px">3.33</td>
		</tr>
		<tr>
			<td style="text-align:center; width:171px">B</td>
			<td style="text-align:center; width:933px">3.00</td>
		</tr>
		<tr>
			<td style="text-align:center; width:171px">B-</td>
			<td style="text-align:center; width:933px">2.67</td>
		</tr>
		<tr>
			<td style="text-align:center; width:171px">C+</td>
			<td style="text-align:center; width:933px">2.33</td>
		</tr>
		<tr>
			<td style="text-align:center; width:171px">C</td>
			<td style="text-align:center; width:933px">2.00</td>
		</tr>
		<tr>
			<td style="text-align:center; width:171px">C-</td>
			<td style="text-align:center; width:933px">1.67</td>
		</tr>
		<tr>
			<td style="text-align:center; width:171px">D+</td>
			<td style="text-align:center; width:933px">1.33</td>
		</tr>
		<tr>
			<td style="text-align:center; width:171px">D</td>
			<td style="text-align:center; width:933px">1.00</td>
		</tr>
		<tr>
			<td style="text-align:center; width:171px">D-</td>
			<td style="text-align:center; width:933px">0.67</td>
		</tr>
		<tr>
			<td style="text-align:center; width:171px">F</td>
			<td style="text-align:center; width:933px">0.00</td>
		</tr>
	</tbody>
</table>
