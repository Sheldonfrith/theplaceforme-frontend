# whereshouldilive

*Currently just a demo, as it will take me a while to gather/calculate all the data I want to include for ever country in order to make this tool truly comprehensive. Depending on server costs, would like to make this a free publicly accessible API.*

This is a backend API (with a simple front-end to display functionality) which will provide a list of questions (and possible answers to those questions). POSTing list of answers to those questions the API will respond with ordered list of locations, highest being the best match based on the answers provided. The database will cache responses to save time. Endpoints will also be available for metadata, like how the responses are calculated, and where the country info is sourced from.

## Endpoints:

### /index  > 
will render a gui website implementing the whereshouldilive API

### /questions > 
will send out the list of questions and their possible answers as JSON

### /locations > 
unordered list of all locations in the database, if given a request with 'answers' the API will calculate a score for 
 each location and send that with the response
 
### /questions return object structure
* also the required HTTP body structure in order to get calculated results from '/locations' endpoint *
questions = {
    categories: {
        government: {
            questions: {
                 001: {
                    name: 'gov-type',
                    text: 'What type of government do you prefer?',
                    info: '',
                    questionWeight: 5,// variable, individual to the user
                    answerType: 'multiple-choice-all-range',
                    allAnswerValueType: 'preference-range', //ex: hate, don't like, neutral, like, love
                    allAnswerValueRange: [0,5] //higher values are always the ones more desired by the user
                    possibleAnswers: {
                        01: {
                            text: 'Democracy',
                            value: null //this is where the user's unique answers get stored, null if nothing has been set by the user for this option
                        },
                        02: {
                            text: 'Monarchy',
                            value: 5, // this user has selected Monarchy as the most desirable possible
                        }
                    },
                },
                002: {
                    name: 'taxation-rate',
                    text: 'What percentage of money in a society should go to the state?',
                    info: 'This will filter locations by their total/overall taxation rates as well as considering the relative size of the government budget to the overall economy. Typically governments have many different taxes, so even if the income tax rate is around 20%, for example, when all other taxes are included the government may be taking 30%- 40% of all the money generated in that country',
                    questionWeigt: 2,// variable, individual to the user
                    answerType: 'range',
                    allAnswerValueType: 'percentage', //tell the ui to display these as a percentage
                    allAnswerValueRange: [0,100],
                    possibleAnswers: {
                        01: {
                            text: null // null if not a multiple choice type question
                            value: 10 // this user has answered 10%
                        }
                    }
                }
            },
            categoryWeight: 10, //variable, individual to the user
        },
        landscape: {
            questions: {
                001: {
                    name: 'favourite-biome',
                    text: 'If you had to pick one type of landscape to live in, what would it be?',
                    info: 'type each category into google image search to get an idea of what it looks like',
                    questionWeight: 5 // these will have default values,
                    answerType: 'multiple-choice-single-true',
                    allAnswerValueType: 'boolean',
                    allAnswerValueRange: [false,true],
                    possibleAnswers: {
                        01: {
                            text: 'mountains',
                            value: false,
                        }
                        02: {
                            text: 'tropical seashore',
                            value: false,
                        }
                        03: {
                            text: 'tropical jungle',
                            value: true,
                        }
                        04: {
                            text: 'arctic tundra',
                            value: false,
                        }
                    }
                }

            },
            categoryWeight: 4,
        },
        demographics: {
            questions: {

            },
            categoryWeight: 5,
        }
    }
}

#### Working with this object:

To record the users answers for a multiple-choice-all-range type question...
    you would, for each category of answer, set questions.categories[categoryName].questions[questionID].possibleAnswers[answerID].value = the value set by the user

To record the answer for a 'range' type question:
    questions.categories[categoryName].questions[questionID].possibleAnswers.001.value

To record the answers for a multiple-choice-single-true:
    questions.categories[categoryName].questions[questionID].possibleAnswers[answerID].value = true for the choice the user selected

To change category weight:
    questions.categories[categoryName].categoryWeight = x

To change question weight:
    questions.categories[categoryName].questions[questionID].questionWeight = x

To add a question:
    const newQuestion = {
        name: 'test-question',
        text: 'Is this question working?',
        info: 'here is where you can put extra information to help the user answer the question well',
        defaultQuestionWeight: 5,
        answerType: 'yesNo',
        allAnswerValueType: 'boolean', 
        allAnswerValueRange: [false,true],
        possibleAnswers: {
            01: {
                text: null,
                defaultValue: null,
            }
        }

    }
    Object.assign(questions.categories[desiredCategory].questions, newQuestion);


### Overall Data Structure (future planning):


CountryName: {
    dataType: {value: ...},
    dataType: {value: ...},
},
CountryName: {
    dataType: {value: ...},
    dataType: {value: ...},
}

Starting from the lowest, least abstracted level

1. Raw Data
    This is data gathered from various sources, it can be in a variety of different formats
    and may be incomplete. EX: list of taxation rates by country, or a ranking of gun laws by US state.
2. Mapping Scripts
    Each raw data set from layer 1 has its own script that takes the data and maps it onto google earth. Each location (ex. country, state, region) in the dataset is set to a 2d shape corresponding to its location on the earth
3. Multi-layer Map Data
    All combined datasets after they have gone through layer 2 form the base dataset for the application, it can be thought of as a map with many overlay layers, each one corresponding to a certain category of data (ex: average annual temperature, taxation rate, lifespan, etc.)
4. Simplification Scripts
    These scripts take each layers data from level 3 and extract metadata that can be used in a higher performance database (level 5). These scripts also divide the entire earth into discrete areas (with only enough resolution to capture differences between the smallest countries in the world) and output a list of these areas to each layer, so that calculations down the line are faster
5. Common Use Database
    Thise database made from level 4 scripts is updated as the lower levels change (maybe once or twice a week), 


## KEY DECISION: CATEGORIZE ALL DATA BY COUNTRY ONLY, NO FINER GRANULARITY
# What qualifies as a country in this database?
    - Must make its own immigration laws, handle its own immigration, be generally self governing
    - CAN BE DEPENDENT on a different nation for foreign policy and defense
    - Citizens/Residents must not be required to pay taxes to a Parent country (except via a double taxation treaty in some cases)

Yes: Curacao, Aruba, Anguilla, British Virgin Islands

No: American Samoa, 
## How to add data to the database?
1. specify the type of data to be added, must allow simple quantitative values to be assigned to each country
2. specify the value for each country
 1. option 1 is manually input for each country, provide interface for this
 2. option 2 is to paste a list, and have a program validate it 
    
## Database Structure:
{
  "rules": {
    ".read": "now < 1602388800000",  // 2020-10-11
    ".write": "now < 1602388800000",  // 2020-10-11
    "datasets":{
      "datasetName":{
        "meta":{
          "longName":"",
          "shortName":"",
          "sourceName":"",
          "sourceLink":"",
        }
        "country1": "Val1",
        "country2": "val2"
      },
      "dataset2":{}
    },
    "countrys":{
      "country1":{
        "meta":{
          "datapoints": "4",
          "sovreign": "UK",
        },
        "dataset1":"3",
        "dataset2":"4",
      },
      "country2":{
        
      }
    }
  }
} 

