/*Create person.person table */
CREATE TABLE IF NOT EXISTS clients (
  id int AUTO_INCREMENT PRIMARY KEY,
  firstName nvarchar(255) NOT NULL,
  lastName nvarchar(255) NOT NULL,
  birthday date,
  gender varchar(64),
  dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP,
  dateModified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  addedBy int NOT NULL /*Self Reference to User ID*/,
  modifiedBy int NOT NULL /*Self Reference to User ID*/,
  FOREIGN KEY (addedBy) REFERENCES users(id),
  FOREIGN KEY (modifiedBy) REFERENCES users(id)
);
/*Insert test data into person table*/

/*Create person Contanct table-Contact M:1 Person*/
CREATE TABLE IF NOT EXISTS contactInformation (
  id int AUTO_INCREMENT PRIMARY KEY,
  clientId int NOT NULL, /*Foreign key reference to person table */
  primaryPhone varchar(32),
  textMessages BOOLEAN, /*Would client like to recieve text messages from CU*/
  email varchar(128),
  address varchar(128),
  city varchar(64),
  zip varchar(32),
  state varchar(2),
  housingStatus ENUM('renter','homeowner','other'), /*Dwelling ownership type, rent or owned(Y/N)*/
  dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP,
  addedBy int NOT NULL, /*Foreign key reference to person table */
  FOREIGN KEY (clientId) REFERENCES clients(id),
  FOREIGN KEY (addedBy) REFERENCES users(id)
);
/*Create Demographics Table M:1 Person*/
CREATE TABLE IF NOT EXISTS demographics (
  id int AUTO_INCREMENT PRIMARY KEY,
  clientId int NOT NULL, /*Foreign key reference to person table*/
  countryOfOrigin varchar(2),
  homeLanguage varchar(32), /* Primary language spoken at home */
  englishProficiency varchar(32), /*English Proficiency of Person*/
  dateOfUSArrival date, /*date of us arrival, day can be and estimation if client does not remember*/
  employed ENUM('yes', 'no', 'n/a', 'unknown'), /*employed, not applicable for age < 16*/
  employmentSector varchar(128), /*Can be null if not employed*/
  payInterval varchar(64),
  weeklyAvgHoursWorked ENUM("0-20","21-35","36-40","41+"), /*Can be null if not employed*/  
  householdSize tinyint, 
  dependents tinyint, /*Replace people under 18 in house hold question*/
  civilStatus varchar(128), /*Not applicable for children age < 17*/
  isStudent BOOLEAN,
  householdIncome int, /*Annual income estimate for household*/
  dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP,
  addedBy int NOT NULL,
  FOREIGN KEY (clientId) REFERENCES clients(id),
  FOREIGN KEY (addedBy) REFERENCES users(id)
);

/*
Create IntakeData Table: Intake data is collected on client inital visits along with person, contact and demographic data*/
CREATE TABLE IF NOT EXISTS intakeData (
  id int AUTO_INCREMENT PRIMARY KEY,
  clientId int NOT NULL,
  dateOfIntake date NOT NULL, /*Not time stap because it maybe different*/
  clientSource ENUM('facebook', 'instagram', 'website', 'promotionalMaterial', 'consulate', 'friend', 'previousClient', 'employee', 'sms', 'radio', 'tv', 'other'), /*how did person hear of CU*/
  registeredVoter varchar(5), /*Y N*/
  registerToVote varchar(5), /*Y N, does client want to register to vote..*/
  couldVolunteer varchar(5), /*Y N*/
  dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP,
  addedBy int NOT NULL,
  FOREIGN KEY (addedby) REFERENCES users(id),
  FOREIGN KEY (clientId) REFERENCES clients(id)
);

/*
Create Services Table: Services are in turn adminstered by a program. Pogram 1:M Services
*/
CREATE TABLE IF NOT EXISTS services (
  id int AUTO_INCREMENT PRIMARY KEY,
  serviceName varchar(64),
  serviceDesc varchar(128),
); 

/*Intake Services is a 1:M intakeData:IntakeServices*/
CREATE TABLE IF NOT EXISTS intakeServices (
  id int AUTO_INCREMENT PRIMARY KEY,
  intakeDataId int NOT NULL,
  serviceId int NOT NULL,
  FOREIGN KEY (intakeDataId) REFERENCES intakeData(id),
  FOREIGN KEY (serviceId) REFERENCES services(id)
);