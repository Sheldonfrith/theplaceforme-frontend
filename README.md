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
 
