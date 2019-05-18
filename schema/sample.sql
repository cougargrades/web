CREATE TABLE IF NOT EXISTS records (
    ID int primary key,
    TERM text,
    DEPT text,
    CATALOG_NBR text,
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
    TERM_CODE int,
    GROUP_CODE text
    );
INSERT INTO records VALUES(1,'Fall 2013','ACCT',4105,1,'PPA Colloquium 1','Newman','Michael Ray',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,201303,'201303-ACCT4105_NewmanMichaelRay');
INSERT INTO records VALUES(2,'Fall 2013','ACCT',4106,1,'PPA Colloquium 2','Newman','Michael Ray',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,201303,'201303-ACCT4106_NewmanMichaelRay');
INSERT INTO records VALUES(3,'Fall 2013','ACCT',4107,1,'Oil and Gas Acct Colloquium','Newman','Michael Ray',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,201303,'201303-ACCT4107_NewmanMichaelRay');
INSERT INTO records VALUES(4,'Fall 2013','ACCT',4396,1,'Accounting Internship','Newman','Michael Ray',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,201303,'201303-ACCT4396_NewmanMichaelRay');
INSERT INTO records VALUES(5,'Fall 2013','ACCT',7105,1,'MS/Accountancy Colloquium','Newman','Michael Ray',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,201303,'201303-ACCT7105_NewmanMichaelRay');
INSERT INTO records VALUES(6,'Fall 2013','ACCT',7396,1,'Accounting Internship','Newman','Michael Ray',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,201303,'201303-ACCT7396_NewmanMichaelRay');
INSERT INTO records VALUES(7,'Fall 2013','ACCT',8999,2,'Doctoral Dissertation','Lobo','Gerald',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,201303,'201303-ACCT8999_LoboGerald');
