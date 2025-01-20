// Initialize visualization containers
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
  
    // Visualize initial dictionary and stack
    forth.visualizeDictionary();
    forth.visualizeStack();
  
    // Handle input commands
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
  