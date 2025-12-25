-- Seed Admin User
INSERT OR IGNORE INTO User (id, username, password, name, role, createdAt, updatedAt) 
VALUES (1, 'admin', '$2b$10$KYAOOcnHJ7ufo.M9c0IQ0ej2HgQi5Lu.OP69I6h.f.3sAe2pi9Ykm', 'Admin User', 'ADMIN', datetime('now'), datetime('now'));

-- Seed Staff User
INSERT OR IGNORE INTO User (id, username, password, name, role, createdAt, updatedAt)
VALUES (2, 'staff', '$2b$10$KYAOOcnHJ7ufo.M9c0IQ0ej2HgQi5Lu.OP69I6h.f.3sAe2pi9Ykm', 'Staff User', 'STAFF', datetime('now'), datetime('now'));

-- Seed Category
INSERT OR IGNORE INTO Category (id, name)
VALUES (1, 'Others');
