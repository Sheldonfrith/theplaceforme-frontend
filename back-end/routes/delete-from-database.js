var express = require('express');
var router = express.Router();
var firebase = require("../lib/FirebaseService");
var database = firebase.database();


router.get('/q', async function(req, res, next) {
  console.log('get request to /delete-from-database with id param '+req.query.datasetID);

    //first delete the entire node in datasets
    const rootRef = database.ref();
    await rootRef.child('datasets').child(req.query.datasetID).set(null);

    //then delete the data from each country
    //COUNTRY DATA
    const countryRef = database.ref('countries');
    let countryData = null;
    await countryRef.once("value", async data => {
        countryData = await data.val();
    });
    Object.keys(countryData).forEach(country=>{
        if (country==='meta') return; // dont count meta field
        const thisRef = rootRef.child('countries').child(country).child(req.query.datasetID);
        thisRef.set(null);
        return;
    });
    
  res.type('text');
  res.send('updated database');
});

module.exports = router;
