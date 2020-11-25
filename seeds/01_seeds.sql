INSERT INTO users (name, email, password)
VALUES ('Sean', 'sean@sean.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Savanna', 'Savanna@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Chrissy', 'chrissy@yahoo.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties 
(owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES
('1', 'Quiet Villa', 'Description', 'thumb url', 'cover url', 300, 1, 1, 2, 'Canada', 'Daniel St', 'Chemainus', 'BC', 'H0H0H0', true),
('3', 'Studio', 'Description', 'thumb url', 'cover url', 300, 1, 1, 2, 'Canada', 'Lewis St', 'Duncan', 'BC', 'H0H0H0', true),
('2', 'Mansion', 'Description', 'thumb url', 'cover url', 5000, 4, 5, 18, 'Canada', 'Rich Ave', 'Snobsville', 'BC', 'XXXXXXX', true);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES 
('03-21-2020', '04-22-2020', 2, 1),
('05-20-2020', '05-22-2020', 1, 2),
('06-21-2020', '06-28-2020', 2, 3);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES
(1, 3, 1, 5, 'loved it!'),
(2, 1, 2, 3, 'Smelled kinda funny'),
(3, 2, 3, 5, 'Amazing!');