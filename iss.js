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

// const validIp = 'https://api.ipify.org?format=json';

const fetchMyIP = function(callback) {
  request(invalidIp, (error, response, body) => {
    // error can be set if invalid domain, user is offline, etc.
    if (error) return callback(error, null);

    // if non-200 status assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response" ${body}`;
      callback(Error(msg), null);
      return;
    }

    try {
      const ipAddress = JSON.parse(body).ip;
      callback(null, ipAddress);
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
      const { latitude, longitude } = parsedBody.latitude;
      callback(null, { latitude, longitude });
    } catch (error) {
      return callback(error, null);
    }

  });



};



//




module.exports = { fetchMyIP, fetchCoordsByIP };