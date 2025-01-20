ForthInterpreter.prototype.then = function() {
  // No operation needed, just a marker for the end of if/else
};

forth.dictionary['then'] = forth.then.bind(forth);