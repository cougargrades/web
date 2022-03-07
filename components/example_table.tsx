import styles from './example_table.module.scss'

export function ExampleTable() {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
      <thead>
        <tr>
          <th>TERM</th>
          <th>SUBJECT</th>
          <th>CATALOG NBR</th>
          <th>...</th>
          {/* <th>CLASS SECTION</th>
          <th>CLASS NUMBER</th>
          <th>COURSE DESCR</th>
          <th>INSTR LAST NAME</th>
          <th>INSTR FIRST NAME</th> */}
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
        {/* <tr>
          <td>Spring 2021</td>
          <td>TMTH</td>
          <td>3360</td>
          <td>6</td>
          <td>22543</td>
          <td>Applied Technical Statistics</td>
          <td>Daniel</td>
          <td>Patrick Nathanial</td>
          <td>8</td>
          <td>16</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>6</td>
          <td>8</td>
          <td>2</td>
          <td>2.623</td>
        </tr> */}
        <tr>
          <td>Spring 2021</td>
          <td>POLS</td>
          <td>6312</td>
          <td>...</td>
          {/* <td>1</td>
          <td>27776</td>
          <td>Institutions and Policy</td>
          <td>Shor</td>
          <td>Boris</td> */}
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
          {/* <td>2</td>
          <td>21205</td>
          <td>Engineering Mathematics</td>
          <td>Caglar</td>
          <td>Atife</td> */}
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
          {/* <td>4</td>
          <td>20395</td>
          <td>Communication Law &amp; Ethics</td>
          <td>Perin</td>
          <td>Monica Wilch</td> */}
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
  )
}