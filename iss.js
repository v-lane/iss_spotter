const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const invalidIp = 'https://ipwho.is/42';

const validIp = 'https://api.ipify.org?format=json';

const fetchMyIP = function(callback) {
  request(validIp, (error, response, body) => {
    // error can be set if invalid domain, user is offline, etc.
    if (error) return callback(error, null);
    // if non-200 status assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response" ${body}`;
      callback(Error(msg), null);
      return;
    }
    try {
      const ip = JSON.parse(body).ip;
      callback(null, ip);
    } catch (error) {
      callback(error, null);
    }
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    //error if invalid domain, etc.
    if (error) return callback(error, null);
    // parse the returned body to check info
    const parsedBody = JSON.parse(body);
    if (!parsedBody.success) {
      const msg = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching IP ${parsedBody.ip}`;
      return callback(Error(msg), null);
    }
    // otherwise continue
    try {
      const { latitude, longitude } = parsedBody;
      callback(null, { latitude, longitude });
    } catch (error) {
      return callback(error, null);
    }

  });
};

//  https://iss-flyover.herokuapp.com/json/?lat=YOUR_LAT_INPUT_HERE&lon=YOUR_LON_INPUT_HERE
//  "response": [
// {"risetime": TIMESTAMP, "duration": DURATION},
// ...
// ]

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS pass times. Response: ${body}`;
      return callback(Error(msg), null);
    }

    const parsedBody = JSON.parse(body);
    //some other error handling
    if (parsedBody.message !== "success") {
      const msg = `Success status was ${parsedBody.message} when fetching response data ${parsedBody.response} `;
      return callback(Error(msg), null);
    }


    try {
      callback(null, parsedBody.response);
      return;
    } catch (error) {
      return callback(error, null);
    }
  });


};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) return callback(error, null);
    fetchCoordsByIP(ip, (error, coords) => {
      if (error) return callback(error, null);
      fetchISSFlyOverTimes(coords, (error, nextPasses) => {
        if (error) return callback(error, null);
        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };