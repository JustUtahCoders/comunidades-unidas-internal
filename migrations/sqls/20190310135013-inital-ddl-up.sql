/* Replace with your SQL commands */
/*dev_trap DDL */

/*TraPO - Data defintion language */

--USE dev_trapo;

/*Create person.person table */
CREATE TABLE IF NOT EXISTS person (
  personid int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  persontype nvarchar(32) NOT NULL, /*PersonType contraint at front end */
  firstname nvarchar(255) NOT NULL,
  lastname nvarchar(255) NOT NULL,
  dob date NOT NULL,
  gender nvarchar(32) NOT NULL,  /*Gender constraint at front end */
  dateadded DATETIME DEFAULT CURRENT_TIMESTAMP,
  datemodified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  addedby int NOT NULL /*Self Reference to Person ID*/,
  modifiedby int NOT NULL /*Self Reference to Person ID*/,
  FOREIGN KEY (addedby) REFERENCES person(personid),
  FOREIGN KEY (modifiedby) REFERENCES person(personid)
);


/*Crate person Contanct table*/
CREATE TABLE IF NOT EXISTS contact (
  personid int NOT NULL, /*Foreign key reference to person table */
  contactid int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  primcontact varchar(32) NOT NULL,
  primcarrier varchar(32) NOT NULL,
  emercontact varchar(32) NULL,
  email varchar(128) NULL,
  dateadded DATETIME DEFAULT CURRENT_TIMESTAMP,
  addedby int NOT NULL, /*Foreign key reference to person table */
  FOREIGN KEY (personid) REFERENCES person(personid),
  FOREIGN KEY (addedby) REFERENCES person(personid)
);

/*Create Demographics Table*/
CREATE TABLE IF NOT EXISTS demographics (
  personid int NOT NULL, /*foreing key reference to person table*/
  demographicid int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  origincountry varchar(32) NOT NULL,
  languagehome varchar(32) NOT NULL,
  engproficiency varchar(32) NOT NULL,
  lenusresidence tinyint NULL, /*in years can be null of country of origin is US residence*/
  employed varchar(1) NOT NULL, /*employed binry Y-U-N*/
  emptype varchar(128) NULL, /*Can be null if not employed*/
  empsector varchar(128) NULL, /*Can be null if not employed*/
  hhsize tinyint NOT NULL, 
  dependants tinyint NOT NULL,
  maritalstatus varchar(128) NOT NULL, /*Not applicable for children age < 17*/
  hhincome varchar(128) NOT NULL, /*Predifined income brackets at front end, not applicable for children*/
  ethnicity varchar(32) NOT NULL,
  dateadded DATETIME DEFAULT CURRENT_TIMESTAMP,
  addedby int NOT NULL,
  FOREIGN KEY (personid) REFERENCES person(personid),
  FOREIGN KEY (addedby) REFERENCES person(personid)
);

/*Create Address table*/
CREATE TABLE IF NOT EXISTS address (
  personid int NOT NULL, /*Foreign key reference to person table*/
  addressid int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  address1 nvarchar(128) NOT NULL,
  address2 nvarchar(128) NULL,
  duelingtype nvarchar(32) NOT NULL, /*Dueling type, home, appartment, duplex, townhome*/
  owned nvarchar(5) NULL, /*Dueling ownership type, rent or owned(Y/N)*/
  city nvarchar(64) NOT NULL,
  zip nvarchar(5) NOT NULL,
  state nvarchar(2) NOT NULL,
  dateadded DATETIME DEFAULT CURRENT_TIMESTAMP,
  addedby int NOT NULL,
  FOREIGN KEY (personid) REFERENCES person(personid),
  FOREIGN KEY (addedby) REFERENCES person(personid)
);

/*
Create users tables
*/
CREATE TABLE IF NOT EXISTS users (
	personid int NOT NULL,
    userid int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    accesslevel nvarchar(32) NOT NULL, 
    username nvarchar(64) NOT NULL,
    image nvarchar(255) NOT NULL,
    password nvarchar(64) NOT NULL,
    FOREIGN KEY (personid) REFERENCES person(personid)
);







