ForthInterpreter.prototype.until = function() {
    if (this.stack.length === 0) return this.error('Stack underflow');
    const condition = this.stack.pop();
    if (condition === 0) {
      // Loop back to the corresponding begin
      this.executionPointer = this.controlFlowStack[this.controlFlowStack.length - 1];
    } else {
      // Exit the loop
      this.controlFlowStack.pop();
    }
  };

forth.dictionary['until'] = forth.until.bind(forth);