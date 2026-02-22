CREATE TABLE IF NOT EXISTS "PopularityContest" (
	"id"	INTEGER NOT NULL,
	"pathname"	TEXT NOT NULL,
	"timestamp_epoch_seconds"	INTEGER NOT NULL DEFAULT 'unixepoch()',
	"metric_type"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE INDEX idx_popularity_metric_time_path
ON PopularityContest(metric_type, timestamp_epoch_seconds, pathname);


-- DROP TABLE IF EXISTS Customers;
-- CREATE TABLE IF NOT EXISTS Customers (CustomerId INTEGER PRIMARY KEY, CompanyName TEXT, ContactName TEXT);
-- INSERT INTO Customers (CustomerID, CompanyName, ContactName) VALUES (1, 'Alfreds Futterkiste', 'Maria Anders'), (4, 'Around the Horn', 'Thomas Hardy'), (11, 'Bs Beverages', 'Victoria Ashworth'), (13, 'Bs Beverages', 'Random Name');