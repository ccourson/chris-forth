ForthInterpreter.prototype.drop = function() {
  if (this.stack.length === 0) return this.error('Stack underflow');
  this.stack.pop();
  this.visualizeStack();
};

forth.dictionary['drop'] = forth.drop.bind(forth);