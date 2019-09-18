ALTER TABLE intakeData
  MODIFY COLUMN clientSource ENUM(
    'facebook',
    'instagram',
    'website',
    'promotionalMaterial',
    'consulate',
    'friend',
    'previousClient',
    'employee',
    'sms',
    'radio',
    'tv',
    'promotora',
    'other'
  );