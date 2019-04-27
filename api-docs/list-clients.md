#Request
GET /clietns?firstName=Mario&lastName=Luigi&zip=84119&page=1

Notes:
-Result is limited to 100 rows
-Values for the query parameters should be URL encoded
-The `page` query parameter defaults to 1
-The `fistName` and `lastName` can be partial -- the backend algorithm applies a "starts with" check

Example Result:
[0:{
FirstName: "Mario"
LastName: "Luigi"
PrimaryPhone: "1115555555"
dob: "1985-10-13T07:00:00.000Z"
zip: "11111"}]
