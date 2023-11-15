CREATE DATABASE do_a_kickflip;

\c do_a_kickflip;

CREATE TABLE skaters (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR,
    last_name VARCHAR,
    age INTEGER,
    years_skating INTEGER
);

CREATE TABLE tricks (
    id SERIAL PRIMARY KEY,
    trick_name VARCHAR
);

CREATE TABLE skaters_tricks (
    skaters_id INTEGER,
    tricks_id INTEGER,
    FOREIGN KEY (skaters_id) REFERENCES skaters(id),
    FOREIGN KEY (tricks_id) REFERENCES tricks(id),
    PRIMARY KEY (skaters_id, tricks_id)
);

CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name TEXT,
    location TEXT
);

CREATE TABLE people (
    id SERIAL PRIMARY KEY,
    first_name TEXT,
    location TEXT,
    company_id INTEGER,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);
