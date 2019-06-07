/* This migration clears out test data from the database, in preparation
   for CU to use our code for their real customer data. For non-prod databases,
   this is fine to run since they won't have any data in there.
*/
DELETE FROM contactInformation;
DELETE FROM demographics;
DELETE FROM intakeServices;
DELETE FROM intakeData;