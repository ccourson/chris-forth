// dup.js
ForthInterpreter.prototype.dup = function() {
  if (this.stack.length === 0) return this.error('Stack underflow');
  this.stack.push(this.stack[this.stack.length - 1]);
  this.visualizeStack();
};

forth.dictionary['dup'] = forth.dup.bind(forth);