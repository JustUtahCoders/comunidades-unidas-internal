CREATE TABLE clientIntakeQuestions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section VARCHAR(64) NOT NULL,
  type VARCHAR (64) NOT NULL,
  dataKey VARCHAR(64) NOT NULL,
  label VARCHAR(256),
  placeholder VARCHAR(256),
  required BOOLEAN NOT NULL,
  disabled BOOLEAN NOT NULL,
  sectionOrder INT NOT NULL
);

INSERT INTO clientIntakeQuestions (
  section,
  type,
  dataKey,
  label,
  placeholder,
  required,
  disabled,
  sectionOrder
) VALUES
(
  'basicInfo',
  'builtin',
  'firstName',
  'First Name',
  NULL,
  true,
  false,
  1
),
(
  'basicInfo',
  'builtin',
  'lastName',
  'Last Name',
  NULL,
  true,
  false,
  2
),
(
  'basicInfo',
  'builtin',
  'birthday',
  'Birthday',
  NULL,
  true,
  false,
  3
),
(
  'basicInfo',
  'builtin',
  'gender',
  'Gender',
  NULL,
  true,
  false,
  4
),
(
  'contactInfo',
  'builtin',
  'phone',
  'Phone',
  NULL,
  true,
  false,
  1
),
(
  'contactInfo',
  'builtin',
  'smsConsent',
  'Wants text messages',
  NULL,
  true,
  false,
  2
),
(
  'contactInfo',
  'builtin',
  'email',
  'Email',
  NULL,
  false,
  false,
  3
),
(
  'contactInfo',
  'builtin',
  'homeAddress.street',
  'Street address',
  '1211 W. 3200 S.',
  false,
  false,
  4
),
(
  'contactInfo',
  'builtin',
  'homeAddress.city',
  'City',
  NULL,
  false,
  false,
  5
),
(
  'contactInfo',
  'builtin',
  'homeAddress.state',
  'State',
  NULL,
  false,
  false,
  6
),
(
  'contactInfo',
  'builtin',
  'homeAddress.zip',
  'Zip',
  NULL,
  false,
  false,
  7
),
(
  'contactInfo',
  'builtin',
  'housingStatus',
  'Rent or Own',
  NULL,
  true,
  false,
  8
),
(
  'demographicInfo',
  'builtin',
  'civilStatus',
  'Civil Status',
  NULL,
  false,
  false,
  1
),
(
  'demographicInfo',
  'builtin',
  'householdIncome',
  'Approximate annual income',
  NULL,
  true,
  false,
  2
),
(
  'demographicInfo',
  'builtin',
  'householdSize',
  'Household size dependent on listed income',
  NULL,
  true,
  false,
  3
),
(
  'demographicInfo',
  'builtin',
  'dependents',
  'Number of household dependents under age 18',
  NULL,
  true,
  false,
  4
),
(
  'demographicInfo',
  'builtin',
  'eligibleToVote',
  'Are they eligible to vote?',
  NULL,
  false,
  false,
  5
),
(
  'demographicInfo',
  'builtin',
  'registeredToVote',
  'Would they like to register to vote?',
  NULL,
  false,
  false,
  6
),
(
  'demographicInfo',
  'builtin',
  'isStudent',
  'Are they a student?',
  NULL,
  false,
  false,
  7
),
(
  'demographicInfo',
  'builtin',
  'currentlyEmployed',
  'Employment status',
  NULL,
  false,
  false,
  8
),
(
  'demographicInfo',
  'builtin',
  'employmentSector',
  'Employment sector',
  NULL,
  false,
  false,
  9
),
(
  'demographicInfo',
  'builtin',
  'payInterval',
  'Pay interval',
  NULL,
  false,
  false,
  10
),
(
  'demographicInfo',
  'builtin',
  'weeklyEmployedHours',
  'Average weekly hours worked',
  NULL,
  false,
  false,
  12
),
(
  'demographicInfo',
  'builtin',
  'countryOfOrigin',
  'Country of origin',
  NULL,
  false,
  false,
  13
),
(
  'demographicInfo',
  'builtin',
  'dateOfUSArrival',
  'Approximate date of U.S. arrival',
  NULL,
  false,
  false,
  14
),
(
  'demographicInfo',
  'builtin',
  'homeLanguage',
  'Primary language in home',
  NULL,
  false,
  false,
  15
),
(
  'demographicInfo',
  'builtin',
  'englishProficiency',
  'English proficiency',
  NULL,
  false,
  false,
  16
),
(
  'intakeInfo',
  'builtin',
  'dateOfIntake',
  'Intake date',
  NULL,
  false,
  false,
  1
),
(
  'intakeInfo',
  'builtin',
  'clientSource',
  'How did they hear about Comunidades Unidas?',
  NULL,
  false,
  false,
  2
),
(
  'intakeInfo',
  'builtin',
  'couldVolunteer',
  'Would they like to volunteer for Comunidades Unidas?',
  NULL,
  false,
  false,
  3
),
(
  'intakeInfo',
  'builtin',
  'intakeServices',
  'Services they are interested in',
  NULL,
  false,
  false,
  4
)
;