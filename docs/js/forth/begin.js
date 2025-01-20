ForthInterpreter.prototype.begin = function() {
    this.controlFlowStack.push(this.executionPointer);
  };

forth.dictionary['begin'] = forth.begin.bind(forth);