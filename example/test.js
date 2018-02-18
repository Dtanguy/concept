var concept = require('concept.js');

concept.init({verbose:false});
//Define concept
concept.add('hello', ['hello', 'hi', 'good evening']);
concept.add('word', ['word', 'planet', 'earth']);


//Normal sentence
console.log(concept.find("Hello word"));

//With strange writing or typo :
console.log(concept.find("Hellooo wordd"));