ALTER TABLE clients
  MODIFY currentlyEmployed ENUM('yes', 'no', 'n/a', 'unknown'),
  ADD payInterval ENUM('every-week', 'every-two-weeks', 'every-month', 'every-quarter', 'every-year'),
  ADD weeklyEmployedHours ENUM('0-20', '21-30', '31-40', '41-more');