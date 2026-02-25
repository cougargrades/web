DROP TABLE IF EXISTS "PopularityContest";
CREATE TABLE IF NOT EXISTS "PopularityContest" (
	"id"	INTEGER NOT NULL,
	"pathname"	TEXT NOT NULL,
	--"timestamp_epoch_seconds"	INTEGER NOT NULL DEFAULT (unixepoch()),
	"date_epoch_seconds"	INTEGER NOT NULL,
	"metric_type"	INTEGER NOT NULL,
	"metric_count"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);

-- CREATE INDEX idx_popularity_metric_time_path
-- ON PopularityContest(date_epoch_seconds, pathname, metric_type);

-- Ensure that each `pathname` only has 1 row per day per metric_type
CREATE UNIQUE INDEX IDX_UQ_POPULARITY
ON PopularityContest(date_epoch_seconds, pathname, metric_type);

/*
Course sample data
*/

-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/c/CHEM%202323', 1);
-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/c/CHEM%202323', 1);
-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/c/CHEM%202323', 1);
-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/c/CHEM%202323', 1);

-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/c/COSC%203320', 1);
-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/c/COSC%203320', 1);
-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/c/COSC%203320', 1);

-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/c/BCHS%203304', 1);
-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/c/COSC%203360', 1);
-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/c/CHEM%202325', 1);
-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/c/MATH%203321', 1);
-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/c/BIOL%203301', 1);
-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/c/MATH%202415', 1);
-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/c/COSC%202436', 1);
-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/c/COSC%204368', 1);

/*
Instructor sample data
*/

-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/i/deng%2C%20xiaoxue', 1);
-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/i/deng%2C%20xiaoxue', 1);
-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/i/deng%2C%20xiaoxue', 1);
-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/i/deng%2C%20xiaoxue', 1);

-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/i/rincon%20castro%2C%20carlos%20alberto', 1);
-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/i/rincon%20castro%2C%20carlos%20alberto', 1);
-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/i/rincon%20castro%2C%20carlos%20alberto', 1);

-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/i/scott%2C%20sean-patrick', 1);
-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/i/bhattacharya%2C%20nandini%20saradindu', 1);
-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/i/young%2C%20crystal%20ann', 1);
-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/i/khurana%2C%20seema', 1);
-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/i/larsen%2C%20russell%20gene', 1);
-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/i/ogletree-hughes%2C%20monique%20l', 1);
-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/i/cai%2C%20chengzhi', 1);
-- INSERT INTO PopularityContest (pathname, metric_type) VALUES ('/i/cai%2C%20chengzhi', 1);


-- DROP TABLE IF EXISTS Customers;
-- CREATE TABLE IF NOT EXISTS Customers (CustomerId INTEGER PRIMARY KEY, CompanyName TEXT, ContactName TEXT);
-- INSERT INTO Customers (CustomerID, CompanyName, ContactName) VALUES (1, 'Alfreds Futterkiste', 'Maria Anders'), (4, 'Around the Horn', 'Thomas Hardy'), (11, 'Bs Beverages', 'Victoria Ashworth'), (13, 'Bs Beverages', 'Random Name');