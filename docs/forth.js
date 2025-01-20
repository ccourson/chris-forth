// Forth Interpreter implemented with prototype-based structure

function ForthInterpreter() {
    this.stack = [];
    this.dictionary = {
      '+': this.add.bind(this),
      '-': this.subtract.bind(this),
      '*': this.multiply.bind(this),
      '/': this.divide.bind(this),
      '.': this.print.bind(this),
      'dup': this.dup.bind(this),
      'drop': this.drop.bind(this),
      'swap': this.swap.bind(this),
      'over': this.over.bind(this),
      'if': this.if.bind(this),
      'else': this.else.bind(this),
      'then': this.then.bind(this),
      'begin': this.begin.bind(this),
      'until': this.until.bind(this),
      '=': this.equals.bind(this),
    };
    this.userWords = {};
    this.controlFlowStack = [];
    this.loopBuffer = [];
    this.inLoop = false;
  }
  
  ForthInterpreter.prototype.add = function() {
    if (this.stack.length < 2) return this.error('Stack underflow');
    const b = this.stack.pop();
    const a = this.stack.pop();
    this.stack.push(a + b);
    this.visualizeStack();
  };
  
  ForthInterpreter.prototype.subtract = function() {
    if (this.stack.length < 2) return this.error('Stack underflow');
    const b = this.stack.pop();
    const a = this.stack.pop();
    this.stack.push(a - b);
    this.visualizeStack();
  };
  
  ForthInterpreter.prototype.multiply = function() {
    if (this.stack.length < 2) return this.error('Stack underflow');
    const b = this.stack.pop();
    const a = this.stack.pop();
    this.stack.push(a * b);
    this.visualizeStack();
  };
  
  ForthInterpreter.prototype.divide = function() {
    if (this.stack.length < 2) return this.error('Stack underflow');
    const b = this.stack.pop();
    const a = this.stack.pop();
    if (b === 0) return this.error('Division by zero');
    this.stack.push(a / b);
    this.visualizeStack();
  };
  
  ForthInterpreter.prototype.equals = function() {
    if (this.stack.length < 2) return this.error('Stack underflow');
    const b = this.stack.pop();
    const a = this.stack.pop();
    this.stack.push(a === b ? 1 : 0);
    this.visualizeStack();
  };
  
  ForthInterpreter.prototype.print = function() {
    if (this.stack.length === 0) return this.error('Stack underflow');
    this.log(this.stack.pop());
    this.visualizeStack();
  };
  
  ForthInterpreter.prototype.dup = function() {
    if (this.stack.length === 0) return this.error('Stack underflow');
    this.stack.push(this.stack[this.stack.length - 1]);
    this.visualizeStack();
  };
  
  ForthInterpreter.prototype.drop = function() {
    if (this.stack.length === 0) return this.error('Stack underflow');
    this.stack.pop();
    this.visualizeStack();
  };
  
  ForthInterpreter.prototype.swap = function() {
    if (this.stack.length < 2) return this.error('Stack underflow');
    const b = this.stack.pop();
    const a = this.stack.pop();
    this.stack.push(b, a);
    this.visualizeStack();
  };
  
  ForthInterpreter.prototype.over = function() {
    if (this.stack.length < 2) return this.error('Stack underflow');
    this.stack.push(this.stack[this.stack.length - 2]);
    this.visualizeStack();
  };
  
  ForthInterpreter.prototype.if = function() {
    if (this.stack.length === 0) return this.error('Stack underflow');
    const condition = this.stack.pop();
    if (condition === 0) {
      this.executionSuspended = true;
    } else {
      this.executionSuspended = false;
    }
    this.controlFlowStack.push('if');
  };
  
  ForthInterpreter.prototype.else = function() {
    if (this.controlFlowStack.length === 0 || this.controlFlowStack[this.controlFlowStack.length - 1] !== 'if') {
      return this.error("'else' without matching 'if'");
    }
    this.executionSuspended = !this.executionSuspended;
    this.controlFlowStack.push('else');
  };
  
  ForthInterpreter.prototype.then = function() {
    if (this.controlFlowStack.length === 0 || (this.controlFlowStack[this.controlFlowStack.length - 1] !== 'if' && this.controlFlowStack[this.controlFlowStack.length - 1] !== 'else')) {
      return this.error("'then' without matching 'if' or 'else'");
    }
    this.controlFlowStack.pop();
    this.executionSuspended = false;
  };
  
  ForthInterpreter.prototype.begin = function() {
    this.controlFlowStack.push({ type: 'begin', index: this.executionPointer });
  };
  
  ForthInterpreter.prototype.until = function() {
    if (this.stack.length === 0) return this.error('Stack underflow');
    const condition = this.stack.pop();
  
    const loopEntry = this.controlFlowStack[this.controlFlowStack.length - 1];
    if (!loopEntry || loopEntry.type !== 'begin') {
      return this.error("'until' without matching 'begin'");
    }
  
    if (condition === 0) {
      this.executionPointer = loopEntry.index - 1; // Rewind to the start of the loop
    } else {
      this.controlFlowStack.pop(); // Exit the loop
    }
  };
  
  ForthInterpreter.prototype.defineWord = function(name, commands) {
    this.userWords[name] = commands;
    this.visualizeDictionary();
  };
  
  ForthInterpreter.prototype.executeWord = function(word) {
    if (!(word in this.userWords)) return this.error(`Unknown word: '${word}'`);
    const commands = this.userWords[word];
    const stackPointer = [];
  
    let pointer = 0;
    while (pointer < commands.length) {
      const token = commands[pointer];
  
      if (token === 'begin') {
        stackPointer.push(pointer); // Store the position of the loop start
      } else if (token === 'until') {
        if (this.stack.length === 0) return this.error('Stack underflow');
        const condition = this.stack.pop();
        if (condition === 0) {
          pointer = stackPointer[stackPointer.length - 1]; // Loop back to 'begin'
          continue;
        } else {
          stackPointer.pop(); // Exit the loop
        }
      } else if (!isNaN(parseFloat(token))) {
        this.stack.push(parseFloat(token));
      } else if (token in this.dictionary) {
        this.dictionary[token]();
      } else if (token in this.userWords) {
        this.executeWord(token); // Recursive call for nested user-defined words
      } else {
        this.error(`Unknown word: '${token}'`);
      }
  
      pointer++;
    }
  
    this.visualizeStack();
  };
  
  ForthInterpreter.prototype.execute = function(command) {
    const tokens = command.split(/\s+/);
    this.executionPointer = 0;
  
    while (this.executionPointer < tokens.length) {
      const token = tokens[this.executionPointer];
  
      if (token === ':') {
        // Start user-defined word
        this.executionPointer++;
        const wordName = tokens[this.executionPointer];
        const wordDefinition = [];
        this.executionPointer++;
  
        while (tokens[this.executionPointer] !== ';' && this.executionPointer < tokens.length) {
          wordDefinition.push(tokens[this.executionPointer]);
          this.executionPointer++;
        }
  
        if (tokens[this.executionPointer] !== ';') {
          return this.error("Missing ';' in word definition");
        }
  
        this.defineWord(wordName, wordDefinition);
        this.log(`Defined word: ${wordName}`);
      } else if (!isNaN(parseFloat(token))) {
        this.stack.push(parseFloat(token));
      } else if (token in this.dictionary) {
        this.dictionary[token]();
      } else if (token in this.userWords) {
        this.executeWord(token);
      } else {
        this.error(`Unknown word: '${token}'`);
      }
  
      this.executionPointer++;
    }
  
    this.visualizeStack();
  };
  
  ForthInterpreter.prototype.log = function(message) {
    const output = document.getElementById('output');
    output.innerHTML += `<br/>${message}`;
    output.scrollTop = output.scrollHeight;
  };
  
  ForthInterpreter.prototype.error = function(message) {
    this.log(`Error: ${message}`);
  };
  
  ForthInterpreter.prototype.visualizeStack = function() {
    const stackContainer = document.getElementById('stack');
    if (stackContainer) {
      stackContainer.innerHTML = `<strong>Stack:</strong> ${this.stack.join(' ')} (top)`;
    }
  };
  
  ForthInterpreter.prototype.visualizeDictionary = function() {
    const dictionaryContainer = document.getElementById('dictionary');
    if (dictionaryContainer) {
      const builtInWords = Object.keys(this.dictionary).join(', ');
      const userWords = Object.keys(this.userWords).join(', ');
      dictionaryContainer.innerHTML = `<strong>Dictionary:</strong><br/><strong>Built-in:</strong> ${builtInWords}<br/><strong>User-defined:</strong> ${userWords || 'None'}`;
    }
  };
  
  // Initialize Forth Interpreter
  (function() {
    const forth = new ForthInterpreter();
  
    // Create dictionary visualization container
    const output = document.getElementById('output');
    const dictionaryContainer = document.createElement('div');
    dictionaryContainer.id = 'dictionary';
    dictionaryContainer.style.marginBottom = '10px';
    dictionaryContainer.style.fontFamily = 'monospace';
    output.parentNode.insertBefore(dictionaryContainer, output);
  
    // Create stack visualization container
    const stackContainer = document.createElement('div');
    stackContainer.id = 'stack';
    stackContainer.style.marginTop = '10px';
    stackContainer.style.fontFamily = 'monospace';
    output.parentNode.insertBefore(stackContainer, output.nextSibling);
  
    forth.visualizeDictionary();
    forth.visualizeStack(); // Ensure stack is displayed on load
  
    const inputField = document.getElementById('input');
    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const command = inputField.value;
        forth.log(`> ${command}`);
        forth.execute(command);
        inputField.value = '';
      }
    });
})();
