ForthInterpreter.prototype.print = function() {
  if (this.stack.length === 0) return this.error('Stack underflow');
  this.log(this.stack.pop());
  this.visualizeStack();
};

forth.dictionary['.'] = forth.print.bind(forth);