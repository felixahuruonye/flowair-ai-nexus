-- Remove problematic bot types that are not working
DELETE FROM bot_types WHERE name IN (
  'AI Video Generator',
  'Flyer Generator', 
  'Logo Generator',
  'Realistic AI Photo Generator',
  'Thumbnail Generator',
  'Voice Over Generator'
);

-- Also remove any user usage records for these bot types to clean up the database
DELETE FROM user_usage WHERE bot_type IN (
  'AI Video Generator',
  'Flyer Generator',
  'Logo Generator', 
  'Realistic AI Photo Generator',
  'Thumbnail Generator',
  'Voice Over Generator'
);