-- schema.sql
-- Create database and table for the Location Tracker

CREATE DATABASE IF NOT EXISTS location_db;
USE location_db;

CREATE TABLE IF NOT EXISTS locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
