INSERT INTO users (
  id,
  full_name,
  email,
  phone,
  address,
  date_of_birth,
  passport_number,
  admin,
  created_at,
  updated_at
) OVERRIDING SYSTEM VALUE VALUES
  (
    1,
    'Bayram Erdem',
    'bayram9erdem@gmail.com',
    '4561767312',
    'Copenhagen, Denmark',
    '1990-01-01',
    'USR0001',
    TRUE,
    NOW(),
    NOW()
  );

SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1), TRUE);

INSERT INTO pets (
  id,
  owner_user_id,
  name,
  species,
  breed,
  sex,
  date_of_birth,
  country_of_birth,
  passport_number,
  microchip_number,
  country_of_issue,
  issue_date,
  current_status,
  photo_url,
  created_at,
  updated_at
) OVERRIDING SYSTEM VALUE VALUES
  (
    1,
    1,
    'Nora',
    'Dog',
    'Golden Retriever',
    'Female',
    '2025-09-01',
    'DK',
    'PP000001',
    '900164784001455',
    'DK',
    CURRENT_DATE,
    'Active',
    '/images/nora.png',
    NOW(),
    NOW()
  );

SELECT setval(pg_get_serial_sequence('pets', 'id'), COALESCE((SELECT MAX(id) FROM pets), 1), TRUE);

INSERT INTO vaccinations (
  id,
  pet_id,
  vaccine_name,
  date_administered,
  next_due,
  veterinarian,
  notes,
  created_at,
  updated_at
) OVERRIDING SYSTEM VALUE VALUES
  (
    1,
    1,
    'Rabies',
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE + INTERVAL '335 days',
    'Bayram Erdem',
    'Local-only seed record for development.',
    NOW(),
    NOW()
  );

SELECT setval(pg_get_serial_sequence('vaccinations', 'id'), COALESCE((SELECT MAX(id) FROM vaccinations), 1), TRUE);
