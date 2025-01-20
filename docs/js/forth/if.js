ForthInterpreter.prototype.if = function() {
  if (this.stack.length === 0) return this.error('Stack underflow');
  const condition = this.stack.pop();
  if (condition === 0) {
    // Skip to else or then
    let depth = 1;
    while (depth > 0 && this.executionPointer < this.tokens.length) {
      this.executionPointer++;
      if (this.tokens[this.executionPointer] === 'if') depth++;
      if (this.tokens[this.executionPointer] === 'then') depth--;
      if (this.tokens[this.executionPointer] === 'else' && depth === 1) break;
    }
  }
};

forth.dictionary['if'] = forth.if.bind(forth);