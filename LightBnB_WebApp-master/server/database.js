const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = (email) => {
  email = email.toLowerCase();
  return pool.query(`
  SELECT * 
  FROM users
  WHERE email = $1;
  `, [email])
    .then((res) => {
      if (res.rows[0]) {
        return res.rows[0];
      } else {
        return null;
      }
    })
    .catch(() => console.log(null));
}

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithId = (id) => {
  const userId = id;
  return pool.query(`
  SELECT * 
  FROM users
  WHERE id = $1;
  `, [userId])
    .then((res) => {
      if (res.rows[0]) {
        return res.rows[0];
      } else {
        return null;
      }
    });
}

exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
// const addUser =  function(user) {
//   const userId = Object.keys(users).length + 1;
//   user.id = userId;
//   users[userId] = user;
//   return Promise.resolve(user);
// }
const addUser = (user) => {
  const name = user.name;
  const email = user.email;
  const password = user.password;
  return pool.query(`
  INSERT INTO users (name, email, password) 
  VALUES ($1, $2, $3)
  RETURNING *;
  `, [name, email, password]);
}

exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool.query(`
  SELECT *
  FROM reservations
  JOIN users ON reservations.guest_id = users.id
  JOIN properties ON reservations.property_id = properties.id
  WHERE reservations.guest_id = $1
  LIMIT $2;
  `, [guest_id, limit])
    .then(res => res.rows);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  let queryParams = [];

  let queryString = `
  SELECT properties.*, AVG(property_reviews.rating) AS average_rating
  FROM properties
  JOIN property_reviews ON property_reviews.property_id = properties.id
  `;

  if (options.city || options.minimum_rating || options.minimum_price_per_night || options.maximum_price_per_night) {
    queryString += 'WHERE';
  }


  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += ` city LIKE $${queryParams.length}`;
  }

  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `
    JOIN users ON properties.owner_id = ${options.owner_id}
    WHERE users.id = $${queryParams.length}
    `;
  }

  if (options.minimum_price_per_night) {
    if (options.city || options.maximum_price_per_night || options.minimum_rating) {
      queryString += ' AND';
    }
    queryParams.push(`${options.minimum_price_per_night}`);
    queryString += ` properties.cost_per_night >= $${queryParams.length}`;
  }

  if (options.maximum_price_per_night) {
    if (options.city || options.minimum_price_per_night || options.minimum_rating) {
      queryString += ' AND';
    }
    queryParams.push(`${options.maximum_price_per_night}`);
    queryString += ` properties.cost_per_night <= $${queryParams.length}`;
  }

  if (options.minimum_rating) {
      if (options.city || options.maximum_price_per_night || options.minimum_price_per_night) {
        queryString += ` AND`;
      }
      queryParams.push(`${options.minimum_rating}`);
      queryString += ` property_reviews.rating >= $${queryParams.length}`;
    }

  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams);


  return pool.query(queryString, queryParams)
    .then(res => res.rows);
}

exports.getAllProperties = getAllProperties;



/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
// const addProperty = function (property) {
//   const propertyId = Object.keys(properties).length + 1;
//   property.id = propertyId;
//   properties[propertyId] = property;
//   return Promise.resolve(property);
// }

const addProperty = (property) => {
  const queryString = `INSERT INTO properties(owner_id, title, description, thumbnail_photo_url, cover_photo_url, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
  RETURNING *;`;
  const queryParams = [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms];

  console.log("Adding");
  console.log(queryString, queryParams);

  return pool.query(queryString, queryParams);
}
exports.addProperty = addProperty;
