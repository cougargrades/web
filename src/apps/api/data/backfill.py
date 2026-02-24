
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
from urllib.parse import urlparse, quote


def main():
  with open('backfill.sql', 'w', encoding='utf8') as fout:
    parser = argparse.ArgumentParser(
      description="Convert GA CSV page views to SQL INSERT statements."
    )
    parser.add_argument(
      "--origin",
      required=True,
      help="Base origin to filter against (e.g. https://cougargrades.io)"
    )
    args = parser.parse_args()

    # we need this so we can only generate SQL INSERT commands for valid rows
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

    origin_parsed = urlparse(args.origin)
    origin_netloc = origin_parsed.netloc
    origin_scheme = origin_parsed.scheme

    reader = csv.DictReader(sys.stdin)

    for row in reader:
      page_location = row.get("page_location")
      timestamp_epoch_seconds = row.get("timestamp_epoch_seconds")
      if not page_location:
        continue

      parsed = urlparse(page_location)

      # Filter by origin
      if parsed.scheme != origin_scheme or parsed.netloc != origin_netloc:
        continue

      # TODO: don't generate, actually just fire at the API ..?
      # TODO: prune bad stuff... but how?

      pathname = parsed.path

      # Skip empty or root-only paths if desired
      if not pathname:
        continue

      # URL-encode properly but preserve slashes
      encoded_pathname = quote(pathname, safe="/")

      if (encoded_pathname not in validUrls):
        continue

      # Escape single quotes for SQL
      encoded_pathname = encoded_pathname.replace("'", "''")

      fout.write(f'-- {datetime.datetime.fromtimestamp(int(timestamp_epoch_seconds))} \n')
      fout.write(f"INSERT INTO PopularityContest (timestamp_epoch_seconds, pathname, metric_type) VALUES ({timestamp_epoch_seconds}, '{encoded_pathname}', 1); \n")


if __name__ == "__main__":
  main()
