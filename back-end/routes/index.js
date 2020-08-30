var express = require('express');
var router = express.Router();

const getResults = (questionaireResults = null) => {
  //verify questionaireResults are in the correct format
  const exampleInput ={
    question1id: {text: 'question1', value: 'testValue'},
    question2id: {text: 'question2', value: 'wrong!'},
    question3id: {text: 'question3', value: 10},
  }
  const checker = {
    question1id: {text: 'question1', value: 'string'},
    question2id: {text: 'question2', value: true},
    question3id: {text: 'question3', value: 1},
  };
  const checkInputStructure = (input, schema) =>{
    Object.keys(schema).forEach(id => {
      try {
        if (input[id].text != schema[id].text || typeof input[id].value != typeof schema[id].value) return false;
      } catch {
        return false;
      }
    })
    return true;
  }
  if (!checkInputStructure(questionaireResults, schema)) throw new Error('questionaire results inproper format');

  //load in all the possible results
  //TODO
  const results = [{},{}];

  //question 1
  const q1Answer = questionaireResults[question1id].value;
  switch (q1Answer) {
    case 'testValue':
      //TODO modify results array order based on this answer
    default: 
      throw new Error('question 1 answer invalid');
  }
}



/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('get request to /');
  // getResults()
  // const questionaireResults = req.body();
  // res.send(getResults(questionaireResults));
  res.send('nothing');
});

module.exports = router;
