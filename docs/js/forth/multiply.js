ForthInterpreter.prototype.multiply = function() {
  if (this.stack.length < 2) return this.error('Stack underflow');
  const b = this.stack.pop();
  const a = this.stack.pop();
  this.stack.push(a * b);
  this.visualizeStack();
};

forth.dictionary['*'] = forth.multiply.bind(forth);