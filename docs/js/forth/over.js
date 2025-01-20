ForthInterpreter.prototype.over = function() {
    if (this.stack.length < 2) return this.error('Stack underflow');
    const b = this.stack[this.stack.length - 2];
    this.stack.push(b);
    this.visualizeStack();
    };

forth.dictionary['over'] = forth.over.bind(forth);