
#!/usr/bin/env python3

'''
Usage: cat input.csv | python3 script.py --origin https://cougargrades.io

CSV must be in format
'''

import sys
import csv
import json
import argparse
import datetime
import sqlite3
from urllib.parse import urlparse, quote, unquote

# Source: https://gist.github.com/vladignatyev/06860ec2040cb497f0f3
def progress(count, total, status=''):
  bar_len = 60
  filled_len = int(round(bar_len * count / float(total)))

  percents = round(100.0 * count / float(total), 1)
  bar = '=' * filled_len + '-' * (bar_len - filled_len)

  sys.stdout.write('[%s] %s%s ...%s\r' % (bar, percents, '%', status))
  sys.stdout.flush()  # As suggested by Rom Ruben (see: http://stackoverflow.com/questions/3173320/text-progress-bar-in-the-console/27871113#comment50529068_27871113)


def main():
  
  parser = argparse.ArgumentParser(
    description="Convert GA CSV page views to SQL INSERT statements."
  )
  parser.add_argument(
    "--origin",
    required=True,
    help="Base origin to filter against (e.g. https://cougargrades.io)"
  )
  parser.add_argument(
    "--input",
    required=True,
    help="The CSV input file"
  )
  parser.add_argument(
    "--output",
    required=True,
    help="The SQL output file"
  )
  args = parser.parse_args()

  # measure how many CSV rows there are
  print('Measuring CSV...')
  csv_row_count = 0
  with open(args.input, 'r') as fin:
    reader = csv.DictReader(fin)
    for _ in reader:
      csv_row_count += 1
  print(f'CSV has {csv_row_count} rows')

  '''
  We need this so we can only generate SQL INSERT commands for valid rows.
  These are unescaped, such as:
  - "/c/AAS 3348"
  - "/i/newman, michael ray"
  - "/groups/10-13121"
  '''
  print('Reading in io.cougargrades.searchables to cache a list of valid URLs...')
  validUrls = set()

  # io.cougargrades.searchable
  with open('./courses.json', 'r') as f:
    data = json.load(f)
    validUrls.update([quote(item["href"], safe="/") for item in data['data']])
  with open('./instructors.json', 'r') as f:
    data = json.load(f)
    validUrls.update([quote(item["href"].lower(), safe="/") for item in data['data']])
  with open('./groups.json', 'r') as f:
    data = json.load(f)
    validUrls.update([quote(item["href"], safe="/") for item in data])

  # Setup the output DB
  print('Setting up output SQLite database...')
  schema_setup_sql = ''
  with open('./schema.sql', 'r') as f:
    schema_setup_sql = f.read()

  # automatically close connection when exited  
  with sqlite3.connect(args.output) as con:
    cur = con.cursor()
    cur.executescript(schema_setup_sql)
    con.commit()

    # parsing `--origin` argument
    origin_parsed = urlparse(args.origin)
    origin_netloc = origin_parsed.netloc
    origin_scheme = origin_parsed.scheme

    # uncommitted
    uncommited_count = 0
    csv_row_progress = 0

    with open(args.input, 'r') as fin:
      reader = csv.DictReader(fin)

      for row in reader:
        csv_row_progress += 1
        progress(csv_row_progress - 1, csv_row_count)
        # this is what we need to end up with
        pathname = ''
        date_epoch_seconds = int(row.get("date_epoch_seconds"))

        # if the CSV uses the "page_location" column, process it differently
        if "page_location" in row:
          # extract the "page_location" column
          page_location = urlparse(row.get("page_location"))

          # Skip row if it's not the origin provided
          if page_location.scheme != origin_scheme or page_location.netloc != origin_netloc:
            continue

          # extract the "pathname"
          # the Python `urlparse()` function will not escape this path and will use it as-is
          pathname = page_location.path
        # if the CSV uses the "page_path" column, process it differently
        elif "page_path" in row:
          pathname = row.get("page_path")
        else:
          continue

        # Do some normalizing to the pathname (our source data has them escaped and unescaped mixed together)
        encoded_pathname = quote(unquote(pathname), safe="/")

        # It must be one that we recognize, not just any old URL
        if (encoded_pathname not in validUrls):
          continue

        # Escape single quotes for SQL
        #encoded_pathname = encoded_pathname.replace("'", "''")

        #cur.execute("INSERT INTO PopularityContest (date_epoch_seconds, pathname, metric_type) VALUES (?, ?, 1)", (date_epoch_seconds, encoded_pathname))
        cur.execute("""
INSERT INTO PopularityContest (
  pathname,
  date_epoch_seconds,
  metric_type,
  metric_count
)
VALUES (
  ?,
  strftime(?,'now','start of day'),
  1,
  1
)
ON CONFLICT(pathname, date_epoch_seconds, metric_type)
DO UPDATE SET
  metric_count = metric_count + 1;
                    """, (encoded_pathname, date_epoch_seconds))
        uncommited_count += 1

        # every X inserts, do a commit
        # every 10% of total uncommitted, do a commit
        # if uncommited_count >= (csv_row_count / 10):
        #   con.commit()
      
    # commit at the end
    con.commit()


if __name__ == "__main__":
  main()
