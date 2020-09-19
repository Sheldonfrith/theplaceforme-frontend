var express = require('express');
var router = express.Router();
var firebase = require("../lib/FirebaseService");
var database = firebase.database();


router.get('/', async function(req, res, next) {
  console.log('get request to /update-database');
  let countryCount=0;
  let countryNames=[];
  //all dataset arrays are in the same order
  let datasetCount=0;
  let datasetNames={};
  let datasetIDs = [];
  let minValues = [];
  let maxValues = [];
    //GET THE VALUES
    //COUNTRY DATA
    const countryRef = database.ref('countries');
    let countryData = null;
    await countryRef.once("value", async data => {
        countryData = await data.val();
    });
    Object.keys(countryData).forEach(country=>{
        if (country==='meta') return; // dont count meta field
        countryCount ++;
        countryNames.push(country);
    })
    //DATASET DATA
    const datasetRef = database.ref('datasets');
    let datasetData = null;
    await datasetRef.once("value", async data => {
        datasetData = await data.val();
    });
    await Object.keys(datasetData).forEach(datasetID=>{
        //do not count metadata field
        if (datasetID === 'meta') return;
        datasetCount ++;
        datasetIDs.push(datasetID);
        datasetNames[datasetID] = (datasetData[datasetID]['meta']['longName']);
        //find min and max datapoints
        // only if dataType is float
        if (datasetData[datasetID].meta.dataType !== 'float') return;
        //first convert all values into an array
        const valuesArray = Object.keys(datasetData[datasetID]).map(country=>{
            if (country==='meta') return;
            else {
                return datasetData[datasetID][country];
            }
        });
        //filter out any strings (ex: "NULL")
        const filteredValuesArray = valuesArray.filter(value => typeof value === 'number');
        maxValues.push(filteredValuesArray.sort((a,b)=>b-a)[0]);
        minValues.push(filteredValuesArray.sort((a,b)=>a-b)[0]);

    });


    //SET THE VALUES
  
    //update global meta
    const rootRef = database.ref();
    await rootRef.update({
        'meta/numberOfDatasets':datasetCount,
        'meta/numberOfCountries': countryCount,
        'datasets/meta/longNames':datasetNames,
        'datasets/meta/count':datasetCount,
        'countries/meta/count':countryCount,
        'countries/meta/names':countryNames.sort(),// sort the country names so the number keys are at least useful in some way
    });
    await datasetIDs.forEach(async (id,index)=>{
        const thisRef = database.ref('datasets/'+id);
        await thisRef.update({
            'meta/minValue':minValues[index],
            'meta/maxValue':maxValues[index],
        })
    })
    
    
  res.type('text');
  res.send('updated database');
});

module.exports = router;
