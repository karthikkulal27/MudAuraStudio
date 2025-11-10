-- Add Role enum and role column to User table
ALTER TABLE `User` ADD COLUMN `role` ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER';
