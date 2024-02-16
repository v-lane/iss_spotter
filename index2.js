const { nextISSTimesForMyLocation } = require("./iss_promised");

const printPassTimes = ((passTimes) => {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    // let date = Date(pass.risetime);
    let duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds.`);
  }
});

nextISSTimesForMyLocation()
  .then(passTimes => printPassTimes(passTimes))
  // .catch(error => console.log("It didn't work: ", error.message));
