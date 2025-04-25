-- CREATE SCHEMA IF NOT EXISTS project_db;
-- SET search_path TO project_db;

-- Drop existing tables
DROP TABLE IF EXISTS News CASCADE;
DROP TABLE IF EXISTS Campaigns CASCADE;
DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Cards CASCADE;
DROP TABLE IF EXISTS Newsletter CASCADE;
DROP TABLE IF EXISTS Donation CASCADE;

-- News table
CREATE TABLE News (
    id UUID PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    img VARCHAR(255),
    about_text TEXT,
    date TIMESTAMP NOT NULL,
    active BOOLEAN NOT NULL
);

-- Campaigns table
CREATE TABLE Campaigns (
    id UUID PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    about_text TEXT NOT NULL,
    img VARCHAR(255),
    target_value DOUBLE PRECISION NOT NULL,
    current_value DOUBLE PRECISION NOT NULL,
    date TIMESTAMP NOT NULL,
    limit_date TIMESTAMP,
    active BOOLEAN NOT NULL
);

-- Users table
CREATE TABLE Users (
    username VARCHAR(64) PRIMARY KEY,
    password VARCHAR(64) NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL
);

-- Cards table
CREATE TABLE Cards (
    nif INT PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL,
    birthday TIMESTAMP NOT NULL
);

-- Newsletter table
CREATE TABLE Newsletter (
    email VARCHAR(128) PRIMARY KEY,
    date_of_deletion TIMESTAMP
);

-- Donation table
CREATE TABLE Donation (
    id VARCHAR(32) PRIMARY KEY,
    nif INT REFERENCES Cards(nif) NOT NULL,
    camp_id VARCHAR(32) REFERENCES Campaigns(id) NOT NULL,
    amount DOUBLE PRECISION NOT NULL
);

-- Indexes
CREATE INDEX idx_news_date ON News(date);
CREATE INDEX idx_news_active ON News(active);
CREATE INDEX idx_campaigns_date ON Campaigns(date);
CREATE INDEX idx_campaigns_active ON Campaigns(active);
CREATE INDEX idx_donations_camp ON Donation(camp_id);