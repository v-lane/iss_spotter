// const { fetchMyIP } = require('./iss');
// const { fetchCoordsByIP } = require('./iss');
// const { fetchISSFlyOverTimes } = require('./iss');

const { nextISSTimesForMyLocation } = require("./iss");



const printPassTimes = ((passTimes) => {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    // let date = Date(pass.risetime);
    let duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds.`)
  }

})

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error)
  }

  printPassTimes(passTimes);

})




// fetchMyIP((error, ip) => {
  //   if (error) {
    //     console.log("It didn't work!" , error);
    //     return;
    //   }
    
    //   console.log('It worked! Returned IP:' , ip);
    // });
    
    // fetchCoordsByIP('42', (error, data) => {
      //   if (error) {
        //     console.log("It didn't work!" , error);
        //     return;
        //   }
        //   console.log('It worked! Returned data', data);
        // });
        
        // fetchISSFlyOverTimes({ latitude: '49.27670', longitude: '-123.13000' }, (error, data) => {
          //   if (error) {
            //     console.log("It didn't work!", error);
            //     return;
            //   }
            //   console.log("It worked! Fly over times are: ", data);
            // });
            