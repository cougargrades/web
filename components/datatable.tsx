import React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { TableCellProps } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import { visuallyHidden } from '@mui/utils'
import styles from './datatable.module.scss'

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
   * The exact width of this column. Setting this value on at least 1 column will change the CSS from "table-layout: auto;" to "table-layout: fixed;"
   */
  width?: number;
  /**
   * The horizontal padding of the header.
   * @default 16
   */
  padding?: number
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
  valueFormatter: (value: T[K]) => string | React.ReactNode;
} : {
  /**
   * Function that allows to apply a formatter before rendering its value.
   * @default (value: T[K]) => T[K]
   */
  valueFormatter?: (value: T[K]) => string | React.ReactNode;
})) }[keyof T];

export interface EnhancedTableProps<T> {
  title?: string;
  columns: Column<T>[];
  rows: T[];
  defaultOrder?: Order;
  defaultOrderBy: keyof T;
  minWidth?: number;
}

export function EnhancedTable<T extends { id: string | number }>({ title, columns, rows, defaultOrder, defaultOrderBy, minWidth }: EnhancedTableProps<T>) {
  const [order, setOrder] = React.useState<Order>(defaultOrder ?? 'asc');
  const [orderBy, setOrderBy] = React.useState<keyof T>(defaultOrderBy);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <div className={styles.root}>
      <Paper className={styles.paper}>
        {
          title ===  undefined ? <></> : 
          <Toolbar>
            <Typography variant="h6" id="tableTitle" component="div">
              {title}
            </Typography>
          </Toolbar>
        }
        <TableContainer>
          <Table
            className={styles.table}
            style={{ width: '100%', minWidth: columns.some(e => e.width) ? undefined : minWidth ?? 600, tableLayout: columns.some(e => e.width) ? 'fixed' : 'auto' }}
            aria-labelledby="tableTitle"
            size={'small'}
            aria-label="enhanced table"
          >
            <TableHead>
              <TableRow>
                {columns.map(col => (
                  <Tooltip key={col.field} title={col.description || ''} placement="top-start" arrow>
                    <TableCell
                      align={col.align}
                      //padding={headCell.disablePadding ? 'none' : 'normal'}
                      sortDirection={orderBy === col.field ? order : false}
                      style={{ width: col.width, paddingLeft: col.padding ?? 16, paddingRight: col.padding ?? 16 }}
                    >
                      <TableSortLabel
                        active={orderBy === col.field}
                        direction={orderBy === col.field ? order : 'asc'}
                        classes={{ icon: styles.sortLabel }}
                        onClick={(event) => handleRequestSort(event, col.field)}
                      >
                        {col.headerName}
                        {orderBy === col.field ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                  </Tooltip>
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
                    {columns.map(({ field, align, padding, valueFormatter }) => (
                      <TableCell key={field} align={align} style={{ paddingLeft: padding ?? 16, paddingRight: padding ?? 16 }}>{valueFormatter ? valueFormatter(row[field]) : row[field]}</TableCell>
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

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  return b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0;
}

export const defaultComparator = (a: string | number, b: string | number) => b < a ? -1 : b > a ? 1 : 0;

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