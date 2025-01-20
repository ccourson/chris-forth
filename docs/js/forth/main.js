// Load all Forth scripts
Promise.all([
  loadScript('js/forth/persistence.js'),
  loadScript('js/forth/add.js'),
  loadScript('js/forth/subtract.js'),
  loadScript('js/forth/multiply.js'),
  loadScript('js/forth/divide.js'),
  loadScript('js/forth/equals.js'),
  loadScript('js/forth/print.js'),
  loadScript('js/forth/dup.js'),
  loadScript('js/forth/drop.js'),
  loadScript('js/forth/swap.js'),
  loadScript('js/forth/over.js'),
  loadScript('js/forth/if.js'),
  loadScript('js/forth/else.js'),
  loadScript('js/forth/then.js'),
  loadScript('js/forth/begin.js'),
  loadScript('js/forth/until.js')
]).then(() => {
  console.log('All Forth scripts loaded.');
  // Initialize the Forth interpreter here if needed
  forth.loadState(); // Load the state from local storage on initialization

  // Save state before the page unloads
  window.addEventListener('beforeunload', () => {
    forth.saveState();
  });
}).catch(error => {
  console.error('Error loading Forth scripts:', error);
});

// Forth Interpreter implemented with prototype-based structure

function ForthInterpreter() {
  this.stack = [];
  this.dictionary = {};
  this.userWords = {};
  this.controlFlowStack = [];
  this.loopBuffer = [];
  this.inLoop = false;
}

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
    const builtInWords = Object.keys(this.dictionary).map(word => `<span class="command-link" onclick="forth.showHelp('${word}')">${word}</span>`).join(', ');
    const userWords = Object.keys(this.userWords).join(', ');
    dictionaryContainer.innerHTML = `<strong>Dictionary:</strong><br/><strong>Built-in:</strong> ${builtInWords}<br/><strong>User-defined:</strong> ${userWords || 'None'}`;
  }
};

ForthInterpreter.prototype.clearStack = function() {
  this.stack = [];
  this.visualizeStack();
  this.log('Stack cleared');
};

ForthInterpreter.prototype.clearDictionary = function() {
  this.userWords = {};
  forth.clearState(); // Clear the state from local storage
  this.visualizeDictionary();
  this.log('Dictionary cleared');
};

ForthInterpreter.prototype.loadHelp = function() {
  fetch('js/forth/help.json')
    .then(response => response.json())
    .then(data => {
      this.helpData = data;
      this.visualizeDictionary(); // Update dictionary to include links
    })
    .catch(error => this.error('Failed to load help data'));
};

ForthInterpreter.prototype.showHelp = function(command) {
  const helpDiv = document.getElementById('help');
  if (this.helpData && this.helpData[command]) {
    helpDiv.innerHTML = `<strong>${command}:</strong> ${this.helpData[command]}`;
  } else {
    helpDiv.innerHTML = `No help available for '${command}'`;
  }
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

ForthInterpreter.prototype.defineWord = function(name, commands) {
  this.userWords[name] = commands;
  this.visualizeDictionary();
};

ForthInterpreter.prototype.execute = function(command) {
  console.log('Executing command:', command);
  this.tokens = command.split(/\s+/);
  this.executionPointer = 0;

  while (this.executionPointer < this.tokens.length) {
    const token = this.tokens[this.executionPointer];
    console.log('Processing token:', token);

    if (token === ':') {
      // Start user-defined word
      this.executionPointer++;
      const wordName = this.tokens[this.executionPointer];
      const wordDefinition = [];
      this.executionPointer++;

      while (this.tokens[this.executionPointer] !== ';' && this.executionPointer < this.tokens.length) {
        wordDefinition.push(this.tokens[this.executionPointer]);
        this.executionPointer++;
      }

      this.defineWord(wordName, wordDefinition);
      // Save state after executing the command
      this.saveState();

      this.executionPointer++;
    } else if (!isNaN(parseFloat(token))) {
      this.stack.push(parseFloat(token));
      this.visualizeStack();
    } else if (token in this.dictionary) {
      this.dictionary[token]();
    } else if (token in this.userWords) {
      this.executeWord(token);
    } else {
      this.error(`Unknown word: '${token}'`);
    }

    this.executionPointer++;
  }
};

ForthInterpreter.prototype.log = function(message) {
  const outputDiv = document.getElementById('output');
  if (outputDiv) {
    outputDiv.innerHTML += `<div>${message}</div>`;
    outputDiv.scrollTop = outputDiv.scrollHeight; // Scroll to the bottom
  }
};

// Function to dynamically load a script
function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Initialize Forth Interpreter
(function() {
  window.forth = new ForthInterpreter();
  forth.loadHelp();
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

  const clearButton = document.getElementById('clear-button');
  clearButton.addEventListener('click', () => {
    forth.clearStack();
  });

  const clearDictionaryButton = document.getElementById('clear-dictionary-button');
  clearDictionaryButton.addEventListener('click', () => {
    forth.clearDictionary();
  });

  const outputDiv = document.getElementById('output');
  outputDiv.addEventListener('focus', () => {
    inputField.focus();
  });
})();
