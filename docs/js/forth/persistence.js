ForthInterpreter.prototype.saveState = function() {
    const state = {
      userWords: this.userWords
    };
    localStorage.setItem('forthState', JSON.stringify(state));
    console.log('State saved to local storage.');
  };
  
  ForthInterpreter.prototype.loadState = function() {
    const state = JSON.parse(localStorage.getItem('forthState'));
    if (state) {
      this.userWords = state.userWords || {};
      this.visualizeStack();
      this.visualizeDictionary();
      console.log('State loaded from local storage.');
    } else {
      console.log('No saved state found in local storage.');
    }
  };
  
  ForthInterpreter.prototype.clearState = function() {
    localStorage.removeItem('forthState');
    console.log('State cleared from local storage.');
  };
