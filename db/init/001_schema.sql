CREATE TABLE IF NOT EXISTS users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  address VARCHAR(255),
  date_of_birth DATE,
  passport_number VARCHAR(50),
  google_id VARCHAR(255) UNIQUE,
  googleid VARCHAR(255) UNIQUE,
  photo TEXT,
  admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pets (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  owner_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(120) NOT NULL,
  species VARCHAR(80) NOT NULL,
  breed VARCHAR(150),
  sex VARCHAR(50),
  color_markings VARCHAR(200),
  date_of_birth DATE,
  country_of_birth CHAR(2),
  microchip_number VARCHAR(50) UNIQUE,
  microchip_implant_date DATE,
  microchip_implant_location VARCHAR(200),
  tattoo_number VARCHAR(50),
  passport_number VARCHAR(50) UNIQUE,
  country_of_issue CHAR(2) NOT NULL DEFAULT 'DK',
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  issuing_authority VARCHAR(200),
  current_status VARCHAR(50) NOT NULL DEFAULT 'Active',
  photo_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vaccinations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  pet_id BIGINT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  vaccine_name VARCHAR(120) NOT NULL,
  date_administered DATE NOT NULL,
  next_due DATE,
  veterinarian VARCHAR(200),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
