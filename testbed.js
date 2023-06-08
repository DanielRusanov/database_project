const md5 = require('md5');
const bcrypt = require('bcrypt');


const testBed = async () => {

    const testString = "Database Project";

    const start = new Date().getTime();

    const end = new Date().getTime();
    console.log("the total time taken is: " + ((end - start) / 1000) + 'seconds')


}

testBed();