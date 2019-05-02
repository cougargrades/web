#!/usr/bin/env python3
import sys
import sqlite3
import csv
import os
# dependencies for pretty printing
from tqdm import tqdm
from halo import Halo

if os.path.exists('records.db'):
    os.remove('records.db')

print(f'Creating records.db...')
conn = sqlite3.connect('records.db')
c = conn.cursor()

# Create table
c.execute('''CREATE TABLE records (
    TERM text,
    SUBJECT text,
    CATALOG_NBR smallint,
    CLASS_SECTION smallint,
    COURSE_DESCR text,
    INSTR_LAST_NAME text,
    INSTR_FIRST_NAME text,
    A smallint,
    B smallint,
    C smallint,
    D smallint,
    F smallint,
    Q smallint,
    AVG_GPA real
    )''')

# Insert a row of data
# c.execute("INSERT INTO stocks VALUES ('2006-01-05','BUY','RHAT',100,35.14)")
conn.commit()

# computing total row estimate for tqdm
spinner = Halo(text='Estimating number of rows...', spinner='dots')
spinner.start()
ROW_ESTIMATE = 0
for arg in sys.argv:
    if arg != sys.argv[0]:
        n = 0
        try:
            with open(arg, 'r') as f:
                for line in f:
                    n += 1
        except Exception as err:
            print(f'Failed to estimate rows.\nException: {err}')
        ROW_ESTIMATE += (n - 1) # dont include header row
spinner.stop_and_persist()
print(f'{ROW_ESTIMATE} rows estimated')

# pretty progress bars
with tqdm(total=ROW_ESTIMATE, unit="rows") as t:
    # for every file provided
    for arg in sys.argv:
        if arg != sys.argv[0]:
            tqdm.write(f'Reading {arg} as a CSV file...')
            try:
                # read the file as a CSV file
                with open(arg, 'r') as csvfile:
                    reader = csv.reader(csvfile)
                    next(reader) # skips header row
                    # for every row, insert into the database and update the progress bar
                    for row in reader:
                        c.execute(f'INSERT INTO records VALUES {str(tuple(row))}') # tuples happen to be SQL syntax: `("hello", 2, false)`
                        t.update()
                    # after every file, commit to the db before continuing to the next file
                    conn.commit()
            except Exception as err:
                tqdm.write(f'Failed to read {arg} as a CSV file.\nException: {err}')

# close the sqlite3 connection
conn.close()