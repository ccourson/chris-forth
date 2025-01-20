ForthInterpreter.prototype.divide = function() {
  if (this.stack.length < 2) return this.error('Stack underflow');
  const b = this.stack.pop();
  const a = this.stack.pop();
  if (b === 0) return this.error('Division by zero');
  this.stack.push(a / b);
  this.visualizeStack();
};

forth.dictionary['/'] = forth.divide.bind(forth);