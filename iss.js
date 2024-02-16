const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    // error can be set if invalid domain, user is offline, etc.
    if (error) return callback(error, null);
    
    // if non-200 status assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statuscode} when fetching IP. Response" ${body}`;
      callback(Error(msg),null);
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


module.exports = { fetchMyIP };