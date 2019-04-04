/* Replace with your SQL commands */
/*
Create users tables: I figured that later on, this application can be scaled to mainain, volunteers, board members, and maybe even donors and staff (HR management) 
*/
CREATE TABLE IF NOT EXISTS users (
  userId int AUTO_INCREMENT PRIMARY KEY,
  firstName varchar(64) NOT NULL,
  lastName varchar(64) NOT NULL,
  accessLevel ENUM('Administrator','Manager','Staff'), 
  userName nvarchar(64) NOT NULL,
  password nvarchar(64) NOT NULL
);

/*Create person.person table */
CREATE TABLE IF NOT EXISTS person (
  personId int AUTO_INCREMENT PRIMARY KEY,
  firstName nvarchar(255) NOT NULL,
  lastName nvarchar(255) NOT NULL,
  dob date,
  gender ENUM('Male','Female','Transgender','Other'),  /*Gender constraint at front end */
  genderComment varchar(128),   /*Other explain optional */
  dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP,
  dateModified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  addedBy int NOT NULL /*Self Reference to User ID*/,
  modifiedBy int NOT NULL /*Self Reference to User ID*/,
  FOREIGN KEY (addedBy) REFERENCES users(userId),
  FOREIGN KEY (modifiedBy) REFERENCES users(userId)
);
/*Insert test data into person table*/

/*Crate person Contanct table-Contact M:1 Person*/
CREATE TABLE IF NOT EXISTS contact (
  personId int NOT NULL, /*Foreign key reference to person table */
  contactId int AUTO_INCREMENT PRIMARY KEY,
  primaryPhone varchar(32),
  primaryCarrier varchar(32),
  textMessages ENUM('Yes','No'), /*Would client like to recieve text messages from CU*/
  email varchar(128),
  address varchar(128),
  owned ENUM('Rent','Own','Other'), /*Dweling ownership type, rent or owned(Y/N)*/
  city varchar(64),
  zip varchar(32),
  state varchar(2),
  dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP,
  addedBy int NOT NULL, /*Foreign key reference to person table */
  FOREIGN KEY (personId) REFERENCES person(personId),
  FOREIGN KEY (addedBy) REFERENCES users(userId)
);
/*Create Demographics Table M:1 Person*/
CREATE TABLE IF NOT EXISTS demographics (
  personId int NOT NULL, /*Foreign key reference to person table*/
  demographicId int AUTO_INCREMENT PRIMARY KEY,
  originCountry varchar(2),
  languageHome varchar(32), /* Primary language spoken at home */
  englishProficiency varchar(32), /*English Proficiency of Person*/
  dateUSArrival date, /*date of us arrival, day can be and estimation if client does not remember*/
  employed ENUM('Yes', 'No','Not Applicable','Unknown'), /*employed, not applicable for age < 16*/
  employmentSector varchar(128), /*Can be null if not employed*/
  payInterval varchar(64),
  weeklyAvgHoursWorked tinyint, /*Can be null if not employed*/  
  householdSize tinyint, 
  dependents tinyint, /*Replace people under 18 in house hold question*/
  maritalStatus varchar(128), /*Not applicable for children age < 17*/
  householdIncome int, /*Annual income estimate for household*/
  dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP,
  addedBy int NOT NULL,
  FOREIGN KEY (personId) REFERENCES person(personId),
  FOREIGN KEY (addedBy) REFERENCES users(userId)
);

/*
Create lead table: Here things get a bit interesting, leads and people are siloed but there is potential for leads to become people, and it would be good to track that..
I think can build this rather easily...
*/
CREATE TABLE IF NOT EXISTS lead (
	leadId int AUTO_INCREMENT PRIMARY KEY,
  firstName varchar(64) NOT NULL,
  lastName varchar(64) NOT NULL,
  leadLocation varchar(128),
  eventName varchar(128),
  prmaryContact varchar(32) NOT NULL,
  zipCode varchar(5) NOT NULL,
  gender varchar(32),
  dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP,
  addedBy int NOT NULL,
  FOREIGN KEY (addedBy) REFERENCES users(userId)
);
/*
Create Programs: CU you can define its programs and programs managers in this table.
*/
CREATE TABLE IF NOT EXISTS programs (
	programId int AUTO_INCREMENT PRIMARY KEY,
  programName varchar(32) NOT NULL,
  description varchar(128),
  programManager int,
  createdDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  programStatus varchar(32),
  FOREIGN KEY (programManager) REFERENCES users(userId)
);
/*
Create Services Table: Services are in turn adminstered by a program. Pogram 1:M Services
*/
CREATE TABLE IF NOT EXISTS services (
	serviceId int AUTO_INCREMENT PRIMARY KEY,
  programId int NOT NULL,
  serviceName varchar(64),
  serviceDesc varchar(128),
  FOREIGN KEY (programId) REFERENCES programs(programId)
);
/*
Create LeadServicesNeeded: When a record is added to leads (def. people who sign up on events to be contacted by cu and in turn may become clients) table it may require more than one serive(s). This table tracks all services required by each lead.. lead 1:M leadServicesNeeded
*/
CREATE TABLE IF NOT EXISTS leadServicesNeeded (
  leadServicedNeededId int AUTO_INCREMENT PRIMARY KEY,
  leadId int NOT NULL,
  serviceId int NOT NULL,
  comments varchar(128),
  dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (serviceId) REFERENCES services(serviceId),
  FOREIGN KEY (leadId) REFERENCES lead(leadId)
);

/*
FROM HERE ON, THE DATABASE IS GETTING INTO MORE DETAIL AND THIS MAYBE PART OF ADDED MODULES.. FOR DISCUSSION
Create Person Lead to Client (When a new a lead becomes a client lead first name, 
last name and gender are turned over to person table, leadToPerson gets an insert to maintain that record)
leadToClient 1:1 Person
*/
CREATE TABLE IF NOT EXISTS leadToClient (
  leadToClientId int AUTO_INCREMENT PRIMARY KEY,
  personId int NOT NULL,
  leadId int NOT NULL,
  comments varchar(5000),
  dateLeadToClient date,
  FOREIGN KEY (personId) REFERENCES person(personId),
  FOREIGN KEY (leadId) REFERENCES lead(leadId)
);
/*
Create IntakeData Table: Intake data is collected on client inital and subsequent visits to CU I expect this to change quite a bit based on feed back form CU
*/
CREATE TABLE IF NOT EXISTS intakeData (
  intakeDataId int AUTO_INCREMENT PRIMARY KEY,
  personId int NOT NULL,
  volunteering varchar(5), /*Y N*/
  clientSource varchar(64), /*how did person hear of CU, Radi, TV, Newspaper, Friend, N/A current client*/
  programId int NOT NULL,
  dateOfIntake date NOT NULL, /*Not time stap because it maybe different*/
  caseNotes varchar(5000),
  registeredVoter varchar(5), /*Y N*/
  servicesInterest int NOT NULL, /*1:1:M intakeData:intakeServices:Services*/
  dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP,
  addedBy int NOT NULL,
  FOREIGN KEY (addedby) REFERENCES users(userId),
  FOREIGN KEY (personId) REFERENCES person(personId)
);
/*Services interested on during intake*/
CREATE TABLE IF NOT EXISTS intakeServices (
  intakeServicesId int AUTO_INCREMENT PRIMARY KEY,
  intakeDataId int NOT NULL,
  personId int NOT NULL,
  serviceId int NOT NULL,
  FOREIGN KEY (intakeDataId) REFERENCES intakeData(intakeDataId),
  FOREIGN KEY (personId) REFERENCES person(personId),
  FOREIGN KEY (serviceId) REFERENCES services(serviceId)
)
