#list-clients API
#POST Request
#URL /api/list-clients/
#Parameters: {firstName, LastName}
Return a list of people's first name, last name, date of birth, zip code, phone number added by and added date.

#Result: An array of results
The result object returns
-First Name: The first name matching the request
-Last Name: Last Name matching request
-dob: date of birth
-zip: conatct zip code
-PrimaryPhone: contact phone number
-addedby: person who added the record to database
-dateadded: datetime when the record was added to database.

#Result size: the number of people who match a first and last name sent with request.
