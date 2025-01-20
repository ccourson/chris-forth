ForthInterpreter.prototype.equals = function() {
  if (this.stack.length < 2) return this.error('Stack underflow');
  const b = this.stack.pop();
  const a = this.stack.pop();
  this.stack.push(a === b ? 1 : 0);
  this.visualizeStack();
};

forth.dictionary['='] = forth.equals.bind(forth);