
DROP TABLE IF EXISTS "PopularityContest";
CREATE TABLE IF NOT EXISTS "PopularityContest" (
	"id"	INTEGER NOT NULL,
	"pathname"	TEXT NOT NULL,
	"date_epoch_seconds"	INTEGER NOT NULL,
	"metric_type"	INTEGER NOT NULL,
	"metric_count"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);

-- Ensure that each `pathname` only has 1 row per day per metric_type
CREATE UNIQUE INDEX IDX_UQ_POPULARITY
ON PopularityContest(date_epoch_seconds, pathname, metric_type);

-- Create a view just for human convenience
DROP VIEW IF EXISTS "PopularityContestHuman";
CREATE VIEW IF NOT EXISTS "PopularityContestHuman"
AS
	SELECT
		id,
		pathname,
		date_epoch_seconds,
		strftime('%F', date_epoch_seconds, 'unixepoch') as date_formatted,
		metric_type,
		metric_count
	FROM PopularityContest;
