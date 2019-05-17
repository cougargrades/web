#!/usr/bin/env python3
import sys
import sqlite3
import csv
import os
# dependencies for pretty printing
from tqdm import tqdm
from halo import Halo

def term_code(term):
    return int(f'{term[term.find(" ")+1:]}{season_code(term[:term.find(" ")])}')

def season_code(season):
    if season == "Spring":
        return "01"
    if season == "Summer":
        return "02"
    if season == "Fall":
        return "03"

def group_code(term, subject, catalog_number, last, first):
    return f'{term_code(term)}-{subject}{catalog_number}_{last.replace(" ","")}{first.replace(" ","")}'

if len(sys.argv) < 2:
    print(f'Usage: {sys.argv[0]} <csvfile> [..csvfile]')
    exit(0)

if os.path.exists('records.db'):
    os.remove('records.db')

print(f'Creating records.db...')
conn = sqlite3.connect('records.db')
c = conn.cursor()

# Create table
c.execute('''CREATE TABLE records (
    TERM text,
    DEPT text,
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
spinner.succeed()
print(f'{ROW_ESTIMATE} rows estimated')


print('Copying rows from CSV...')
with tqdm(total=ROW_ESTIMATE, unit="rows") as t:
    # for every file provided
    for arg in sys.argv:
        if arg != sys.argv[0]:
            head, tail = os.path.split(arg)
            #tqdm.write(f'Reading {tail}...')
            try:
                # read the file as a CSV file
                with open(arg, 'r') as csvfile:
                    reader = csv.reader(csvfile)
                    next(reader) # skips header row
                    # for every row, insert into the database and update the progress bar
                    for row in reader:
                        # "Fall 2013",ACCT,4105,1,"PPA Colloquium 1",Newman,"Michael Ray",,,,,,,
                        c.execute(f'INSERT INTO records VALUES {str(tuple(row))}') # tuples happen to be SQL syntax: `("hello", 2, false)` 
                        t.update()
                    # after every file, commit to the db before continuing to the next file
                    conn.commit()
            except Exception as err:
                tqdm.write(f'Failed to read {short_arg} as a CSV file.\nException: {err}')

conn.commit()
conn.close()

print('Computing extra columns...')
spinner = Halo(text='Computing COUNT() and AVG()...', spinner='dots')
spinner.start()

conn = sqlite3.connect('records.db')
cread = conn.cursor()
cwrite = conn.cursor()

cwrite.execute('''CREATE TABLE records_extra (
    ID int primary key,
    TERM text,
    DEPT text,
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
    AVG_GPA real,
    PROF_COUNT smallint,
    PROF_AVG real,
    TERM_CODE smallint,
    GROUP_CODE text
    )''')
conn.commit()

# compute count()/avg()
cread.execute('''
SELECT 
records.TERM, records.DEPT, records.CATALOG_NBR, records.CLASS_SECTION, records.COURSE_DESCR, records.INSTR_LAST_NAME, records.INSTR_FIRST_NAME, 
records.A, records.B, records.C, records.D, records.F, records.Q, records.AVG_GPA,
t2.PROF_COUNT, t2.PROF_AVG FROM records

LEFT JOIN(SELECT COUNT(records.AVG_GPA) AS PROF_COUNT, AVG(records.AVG_GPA) AS PROF_AVG, records.TERM, records.DEPT, records.CATALOG_NBR, records.INSTR_LAST_NAME, records.INSTR_FIRST_NAME FROM records GROUP BY TERM, DEPT, CATALOG_NBR, INSTR_LAST_NAME, INSTR_FIRST_NAME) t2

ON records.TERM = t2.TERM AND records.DEPT = t2.DEPT AND records.CATALOG_NBR = t2.CATALOG_NBR AND records.INSTR_LAST_NAME = t2.INSTR_LAST_NAME AND records.INSTR_FIRST_NAME = t2.INSTR_FIRST_NAME
''')
spinner.succeed()

print('Creating extra table from copied table...', end="")
row = cread.fetchone()
id_num = 1
with tqdm(total=ROW_ESTIMATE, unit="rows") as t:
    while row != None:
        tup = list(row)
        # insert ID, TERM_CODE, and GROUP_CODE
        tup = [id_num] + tup + [term_code(row[0]), group_code(row[0],row[1],row[2],row[5],row[6])]

        # (822, 'Fall 2013', 'GEOL', 8398, 27, 'Doctoral Research', 'Han', 'De-Hua', '', '', '', '', '', '', '', 1, 0.0, 201303, '201303-GEOL8398_HanDe-Hua')
        #  0    1            2       3     4   5                    6      7         8   9   10  11  12  13  14  15 16   17      18

        # if grade not supplied, set grade-related cells to None
        if tup[8] == '':
            for i in range(8,15): # [8,15)
                tup[i] = None
            tup[16] = None

        cwrite.execute(f'INSERT INTO records_extra VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', tuple(tup))
        # if id_num % 2000 == 0:
        #    tqdm.write(f'Processed row {id_num}')
        id_num += 1
        t.update()
        row = cread.fetchone()

# close the sqlite3 connection
conn.commit()
print('Done')

print('Dropping original table and renaming extra table...', end="")
cwrite.execute('DROP TABLE records')
cwrite.execute('''
ALTER TABLE records_extra
RENAME TO records
''')
conn.commit()
conn.close()
print('Done')
