BEGIN;

DELETE FROM vaccinations
WHERE pet_id IN (
  SELECT id
  FROM pets
  WHERE passport_number LIKE 'D33-%'
);

DELETE FROM pets
WHERE passport_number LIKE 'D33-%';

DELETE FROM users
WHERE email LIKE '%@petpass-demo.local';

INSERT INTO users (
  full_name,
  email,
  phone,
  address,
  date_of_birth,
  passport_number,
  admin,
  created_at,
  updated_at
) VALUES
  ('Siobhan O''Sullivan', 'siobhan.osullivan@petpass-demo.local', '+353 85 110 0001', 'Cork, Ireland', '1991-04-16', 'D33USR001', FALSE, NOW(), NOW()),
  ('Emre Yildiz', 'emre.yildiz@petpass-demo.local', '+90 532 110 0002', 'Izmir, Turkey', '1988-11-02', 'D33USR002', FALSE, NOW(), NOW()),
  ('Aiko Tanaka', 'aiko.tanaka@petpass-demo.local', '+81 90 1100 0003', 'Yokohama, Japan', '1993-01-27', 'D33USR003', FALSE, NOW(), NOW()),
  ('Giulia Romano', 'giulia.romano@petpass-demo.local', '+39 331 110 0004', 'Bologna, Italy', '1986-07-09', 'D33USR004', FALSE, NOW(), NOW()),
  ('Ingrid Solheim', 'ingrid.solheim@petpass-demo.local', '+47 412 11 005', 'Bergen, Norway', '1994-09-12', 'D33USR005', FALSE, NOW(), NOW()),
  ('Javier Navarro', 'javier.navarro@petpass-demo.local', '+34 611 100 006', 'Valencia, Spain', '1990-03-03', 'D33USR006', FALSE, NOW(), NOW()),
  ('Freja Mikkelsen', 'freja.mikkelsen@petpass-demo.local', '+45 31 11 00 07', 'Aarhus, Denmark', '1996-05-22', 'D33USR007', FALSE, NOW(), NOW()),
  ('Aino Korhonen', 'aino.korhonen@petpass-demo.local', '+358 44 110 0008', 'Turku, Finland', '1989-12-14', 'D33USR008', FALSE, NOW(), NOW());

INSERT INTO pets (
  owner_user_id,
  name,
  species,
  breed,
  sex,
  color_markings,
  date_of_birth,
  country_of_birth,
  microchip_number,
  passport_number,
  country_of_issue,
  issue_date,
  issuing_authority,
  current_status,
  created_at,
  updated_at
) VALUES
  ((SELECT id FROM users WHERE email = 'siobhan.osullivan@petpass-demo.local'), 'Finn', 'Cat', 'Somali', 'Female', 'Cinnamon tail tip', '2020-02-14', 'IE', 'D33MC001', 'D33-PP001', 'IE', '2025-01-12', 'Nordic Vet Group', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'emre.yildiz@petpass-demo.local'), 'Boncuk', 'Dog', 'Vizsla', 'Male', 'Copper chest patch', '2019-08-03', 'TR', 'D33MC002', 'D33-PP002', 'TR', '2025-02-01', 'Harbor Animal Clinic', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'aiko.tanaka@petpass-demo.local'), 'Sora', 'Parrot', 'Caique', 'Male', 'Green wing feathers', '2021-06-19', 'JP', 'D33MC003', 'D33-PP003', 'JP', '2025-02-18', 'City Aviary Care', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'giulia.romano@petpass-demo.local'), 'Luna', 'Dog', 'Samoyed', 'Female', 'Snow white coat', '2018-12-11', 'IT', 'D33MC004', 'D33-PP004', 'IT', '2025-02-28', 'North Shore Vets', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'ingrid.solheim@petpass-demo.local'), 'Bamse', 'Dog', 'Nova Scotia Duck Tolling Retriever', 'Male', 'Amber ears', '2022-03-09', 'NO', 'D33MC005', 'D33-PP005', 'NO', '2025-03-03', 'Maple Pet Health', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'javier.navarro@petpass-demo.local'), 'Canela', 'Cat', 'Turkish Van', 'Female', 'Ginger crown mark', '2021-04-17', 'ES', 'D33MC006', 'D33-PP006', 'ES', '2025-03-06', 'Old Town Vet House', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'freja.mikkelsen@petpass-demo.local'), 'Birk', 'Rabbit', 'Lionhead', 'Male', 'Grey mane', '2023-01-30', 'DK', 'D33MC007', 'D33-PP007', 'DK', '2025-03-08', 'Garden Pet Practice', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'aino.korhonen@petpass-demo.local'), 'Sisu', 'Dog', 'Basenji', 'Female', 'White paws', '2020-10-07', 'FI', 'D33MC008', 'D33-PP008', 'FI', '2025-03-11', 'Canal Vet Center', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'siobhan.osullivan@petpass-demo.local'), 'Murphy', 'Cat', 'Devon Rex', 'Male', 'Cream whisker stripe', '2019-11-29', 'IE', 'D33MC009', 'D33-PP009', 'IE', '2025-03-15', 'Nordic Vet Group', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'emre.yildiz@petpass-demo.local'), 'Duman', 'Dog', 'Weimaraner', 'Female', 'Silver blaze', '2017-05-21', 'TR', 'D33MC010', 'D33-PP010', 'TR', '2025-03-18', 'Harbor Animal Clinic', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'aiko.tanaka@petpass-demo.local'), 'Yuki', 'Ferret', 'Standard Ferret', 'Male', 'Mask face', '2022-09-13', 'JP', 'D33MC011', 'D33-PP011', 'JP', '2025-03-22', 'City Aviary Care', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'giulia.romano@petpass-demo.local'), 'Stella', 'Dog', 'Keeshond', 'Female', 'Black saddle coat', '2018-01-05', 'IT', 'D33MC012', 'D33-PP012', 'IT', '2025-03-26', 'North Shore Vets', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'ingrid.solheim@petpass-demo.local'), 'Tassen', 'Dog', 'Miniature Pinscher', 'Male', 'Rust eyebrows', '2021-07-14', 'NO', 'D33MC013', 'D33-PP013', 'NO', '2025-03-29', 'Maple Pet Health', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'javier.navarro@petpass-demo.local'), 'Lola', 'Cat', 'Japanese Bobtail', 'Female', 'Black tail pom', '2020-06-06', 'ES', 'D33MC014', 'D33-PP014', 'ES', '2025-04-02', 'Old Town Vet House', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'freja.mikkelsen@petpass-demo.local'), 'Mille', 'Dog', 'Border Terrier', 'Male', 'Wiry tan muzzle', '2019-09-24', 'IE', 'D33MC015', 'D33-PP015', 'DK', '2025-04-04', 'Garden Pet Practice', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'aino.korhonen@petpass-demo.local'), 'Helmi', 'Goat', 'Pygmy Goat', 'Female', 'White knee spots', '2022-04-27', 'FI', 'D33MC016', 'D33-PP016', 'FI', '2025-04-07', 'Canal Vet Center', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'siobhan.osullivan@petpass-demo.local'), 'Bran', 'Dog', 'Australian Kelpie', 'Female', 'Black and tan coat', '2021-08-30', 'IE', 'D33MC017', 'D33-PP017', 'IE', '2025-04-10', 'Nordic Vet Group', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'emre.yildiz@petpass-demo.local'), 'Fistik', 'Cat', 'Chartreux', 'Male', 'Blue-grey fur', '2018-03-16', 'TR', 'D33MC018', 'D33-PP018', 'TR', '2025-04-12', 'Harbor Animal Clinic', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'aiko.tanaka@petpass-demo.local'), 'Hana', 'Dog', 'Italian Greyhound', 'Female', 'Rose nose', '2022-02-02', 'JP', 'D33MC019', 'D33-PP019', 'JP', '2025-04-15', 'City Aviary Care', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'giulia.romano@petpass-demo.local'), 'Pepe', 'Dog', 'Belgian Laekenois', 'Male', 'Tousled sandy coat', '2020-11-01', 'IT', 'D33MC020', 'D33-PP020', 'IT', '2025-04-18', 'North Shore Vets', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'ingrid.solheim@petpass-demo.local'), 'Lykke', 'Cat', 'Havana Brown', 'Female', 'Mahogany coat', '2019-12-07', 'NO', 'D33MC021', 'D33-PP021', 'NO', '2025-04-20', 'Maple Pet Health', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'javier.navarro@petpass-demo.local'), 'Rio', 'Dog', 'Lagotto Romagnolo', 'Male', 'Curly cream coat', '2021-01-18', 'ES', 'D33MC022', 'D33-PP022', 'ES', '2025-04-22', 'Old Town Vet House', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'freja.mikkelsen@petpass-demo.local'), 'Otto', 'Cat', 'Burmilla', 'Female', 'Silver shaded fur', '2023-02-09', 'DK', 'D33MC023', 'D33-PP023', 'DK', '2025-04-24', 'Garden Pet Practice', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'aino.korhonen@petpass-demo.local'), 'Myrsky', 'Dog', 'Finnish Spitz', 'Male', 'Fox-red tail', '2020-08-08', 'FI', 'D33MC024', 'D33-PP024', 'FI', '2025-04-26', 'Canal Vet Center', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'siobhan.osullivan@petpass-demo.local'), 'Roisin', 'Chicken', 'Silkie', 'Female', 'Blue feather puff', '2024-03-05', 'IE', 'D33MC025', 'D33-PP025', 'IE', '2025-04-28', 'Nordic Vet Group', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'emre.yildiz@petpass-demo.local'), 'Minik', 'Dog', 'Norwegian Buhund', 'Male', 'Wheat coat', '2019-04-14', 'TR', 'D33MC026', 'D33-PP026', 'TR', '2025-05-01', 'Harbor Animal Clinic', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'aiko.tanaka@petpass-demo.local'), 'Kiko', 'Cat', 'LaPerm', 'Female', 'Soft curly coat', '2022-07-07', 'JP', 'D33MC027', 'D33-PP027', 'JP', '2025-05-03', 'City Aviary Care', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'giulia.romano@petpass-demo.local'), 'Briciola', 'Dog', 'Bearded Collie', 'Female', 'Grey beard fringe', '2018-06-01', 'IT', 'D33MC028', 'D33-PP028', 'IT', '2025-05-05', 'North Shore Vets', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'ingrid.solheim@petpass-demo.local'), 'Snofnugg', 'Dog', 'Eurasier', 'Male', 'Smoky sable fur', '2021-11-23', 'NO', 'D33MC029', 'D33-PP029', 'NO', '2025-05-06', 'Maple Pet Health', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'javier.navarro@petpass-demo.local'), 'Nico', 'Cat', 'Tonkinese', 'Female', 'Aqua eyes', '2020-09-19', 'ES', 'D33MC030', 'D33-PP030', 'ES', '2025-05-07', 'Old Town Vet House', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'freja.mikkelsen@petpass-demo.local'), 'Alma', 'Rabbit', 'Mini Rex', 'Female', 'Velvet chocolate ears', '2023-05-12', 'DK', 'D33MC031', 'D33-PP031', 'DK', '2025-05-08', 'Garden Pet Practice', 'Active', NOW(), NOW()),
  ((SELECT id FROM users WHERE email = 'aino.korhonen@petpass-demo.local'), 'Nuppu', 'Dog', 'Spanish Water Dog', 'Male', 'Dark curly coat', '2020-01-25', 'FI', 'D33MC032', 'D33-PP032', 'FI', '2025-05-09', 'Canal Vet Center', 'Active', NOW(), NOW());

COMMIT;
