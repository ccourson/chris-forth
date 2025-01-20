ForthInterpreter.prototype.swap = function() {
  if (this.stack.length < 2) return this.error('Stack underflow');
  const b = this.stack.pop();
  const a = this.stack.pop();
  this.stack.push(b, a);
  this.visualizeStack();
};

forth.dictionary['swap'] = forth.swap.bind(forth);
