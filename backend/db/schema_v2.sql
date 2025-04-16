-- News table
DROP TABLE IF EXISTS news CASCADE;
CREATE TABLE IF NOT EXISTS news (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    description TEXT,
    date TIMESTAMP NOT NULL,
    active BOOLEAN NOT NULL
);

-- Campaigns table
DROP TABLE IF EXISTS campaigns CASCADE;
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    target_value NUMERIC(10, 2),
    current_value NUMERIC(10, 2) NOT NULL,
    date TIMESTAMP NOT NULL,
    limit_date TIMESTAMP,
    active BOOLEAN NOT NULL
);

-- Users table
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(64) PRIMARY KEY,
    password VARCHAR(64) NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL
);

-- Newsletter table
DROP TABLE IF EXISTS newsletter CASCADE;
CREATE TABLE IF NOT EXISTS newsletter (
    email VARCHAR(128) PRIMARY KEY,
    date_of_deletion TIMESTAMP
);

-- Cards table
DROP TABLE IF EXISTS cards CASCADE;
CREATE TABLE IF NOT EXISTS cards (
    nif INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(128) NOT NULL,
    birthday TIMESTAMP NOT NULL
);

-- Donation table
DROP TABLE IF EXISTS donation CASCADE;
CREATE TABLE IF NOT EXISTS donation (
    id UUID PRIMARY KEY,
    nif INT NOT NULL REFERENCES cards(nif),
    camp_id UUID NOT NULL REFERENCES campaigns(id),
    amount NUMERIC(10, 2) NOT NULL
);
