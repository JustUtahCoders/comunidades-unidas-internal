#Request
GET /clietns?firstName=Mario&lastName=Luigi&zip=84119&page=1

Notes:
-Result is limited to 100 rows
-Values for the query parameters should be URL encoded
-The `page` query parameter defaults to 1
-The `fistName` and `lastName` can be partial -- the backend algorithm applies a "starts with" check

Example Result:
[0:{
PrimaryPhone: "8016742989"
addedBy: "Developers CU"
addedById: 1
dateAdded: "04/28/2019"
dob: "02/28/1984"
firstName: "Leonel"
id: 5
lastName: "Nieto"
zip: "84119"}]
