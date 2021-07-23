import React from 'react'
import Box from '@material-ui/core/Box'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import { visuallyHidden } from '@material-ui/utils'
import styles from './datatable.module.scss'
import { TableCellProps } from '@material-ui/core/TableCell'

/**
 * Used for deciding how the table should operate for a column, including labels and sorting for complex objects
 * Uses TypeScript wizardy.
 */
export type Column<T> = { [K in keyof T]: ({
  /**
   * The column identifier. It's used to map with [[GridRowData]] values.
   */
  field: Exclude<K, Symbol>;
  /**
   * The title of the column rendered in the column header cell.
   * @default K
   */
  headerName?: string;
  /**
   * The description of the column rendered as tooltip if the column header name is not fully displayed.
   * @default ''
   */
  description?: string;
  /**
   * If `true`, hide the column.
   * @default false
   */
  hide?: boolean;
  /**
   * How to align the column
   * @default 'inherit'
   */
  align?: TableCellProps['align'];
  /**
   * The type of the column as a string
   * @default typeof T[K]
   */
  type: T[K] extends string ? 'string' : T[K] extends number ? 'number' : T[K] extends Date ? 'Date' : T[K] extends boolean ? 'boolean' : T[K] extends undefined ? 'undefined' : T[K] extends object ? string : string;  
} & (T[K] extends (string | number) ? {
  // If T[K] is a string or number, we can use a built-in comparator easily
  /**
   * A comparator function used to sort rows. Must sort in descending order.
   * @default undefined
   */
  sortComparator?: (a: T, b: T) => number;
} : {
  // If T[K] is something else, they're going to need to provide us with a comparator
  /**
   * A comparator function used to sort rows. Must sort in descending order.
   * @default undefined
   */
  sortComparator: (a: T, b: T) => number;
}) & (T[K] extends object ? {
  /**
   * Function that allows to apply a formatter before rendering its value.
   * @default (value: T[K]) => T[K]
   */
  valueFormatter: (value: T[K]) => string;
} : {
  /**
   * Function that allows to apply a formatter before rendering its value.
   * @default (value: T[K]) => T[K]
   */
  valueFormatter?: (value: T[K]) => string;
})) }[keyof T];

export interface EnhancedTableProps<T> {
  title: string;
  columns: Column<T>[];
  rows: T[];
  defaultOrder: keyof T;
}

export function EnhancedTable<T extends { id: string | number }>({ title, columns, rows, defaultOrder }: EnhancedTableProps<T>) {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof T>(defaultOrder);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <div className={styles.root}>
      <Paper className={styles.paper}>
        <Toolbar>
          <Typography variant="h6" id="tableTitle" component="div">
            {title}
          </Typography>
        </Toolbar>
        <TableContainer>
          <Table
            className={styles.table}
            aria-labelledby="tableTitle"
            size={'small'}
            aria-label="enhanced table"
          >
            <TableHead>
              <TableRow>
                {columns.map(headCell => (
                  <TableCell
                    key={headCell.field}
                    align={headCell.align}
                    //padding={headCell.disablePadding ? 'none' : 'normal'}
                    sortDirection={orderBy === headCell.field ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.field}
                      direction={orderBy === headCell.field ? order : 'asc'}
                      onClick={(event) => handleRequestSort(event, headCell.field)}
                    >
                      {headCell.headerName}
                      {orderBy === headCell.field ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* stableSort(rows, getComparator(order, orderBy)) */}
              {stableSort(rows, (a: T, b: T) => {
                const col = columns.find(e => e.field === orderBy);
                // If we're ordering by a string or a number, we can use the built-in comparator
                if(['string','number'].includes(col.type)) {
                  return order === 'desc' ? descendingComparator(a, b, orderBy) : -descendingComparator(a, b, orderBy);
                }
                else {
                  // Otherwise, we have to rely on the user-supplied comparator
                  return order === 'desc' ? col.sortComparator(a, b) : -col.sortComparator(a, b);
                }
              })
                .map(row => (
                  <TableRow
                    key={row.id}
                    tabIndex={-1}
                  >
                    {columns.map(({ field, align, valueFormatter }) => (
                      <TableCell key={field} align={align}>{valueFormatter ? valueFormatter(row[field]) : row[field]}</TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

// Util functions

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  return b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0;
}

type Order = 'asc' | 'desc';

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}