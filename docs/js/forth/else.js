ForthInterpreter.prototype.else = function() {
  // Skip to then
  let depth = 1;
  while (depth > 0 && this.executionPointer < this.tokens.length) {
    this.executionPointer++;
    if (this.tokens[this.executionPointer] === 'if') depth++;
    if (this.tokens[this.executionPointer] === 'then') depth--;
  }
};

forth.dictionary['else'] = forth.else.bind(forth);