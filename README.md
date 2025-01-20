# chris-forth

A simple Forth interpreter written in JavaScript.

## Overview

This project implements a Forth interpreter using JavaScript. It provides a web-based interface where users can enter Forth commands and see the results in real-time.

## Features

- Basic arithmetic operations: `+`, `-`, `*`, `/`
- Stack manipulation: `dup`, `drop`, `swap`, `over`
- Control flow: `if`, `else`, `then`, `begin`, `until`
- Comparison: `=`
- User-defined words
- Interactive help for built-in commands

## Usage

1. Open `index.html` in a web browser.
2. Enter Forth commands in the input field and press Enter to execute them.
3. The output will be displayed in the output div.
4. The stack and dictionary will be visualized below the input field.
5. Click on any built-in command in the dictionary to see its help information.

## Built-in Commands

The following built-in commands are available:

- `+`: Adds the top two numbers on the stack. ( n1 n2 -- n3 )
- `-`: Subtracts the top number from the second top number on the stack. ( n1 n2 -- n3 )
- `*`: Multiplies the top two numbers on the stack. ( n1 n2 -- n3 )
- `/`: Divides the second top number by the top number on the stack. Division by zero is not allowed. ( n1 n2 -- n3 )
- `.`: Prints the top number on the stack. ( n -- )
- `dup`: Duplicates the top number on the stack. ( n -- n n )
- `drop`: Removes the top number from the stack. ( n -- )
- `swap`: Swaps the top two numbers on the stack. ( n1 n2 -- n2 n1 )
- `over`: Copies the second top number to the top of the stack. ( n1 n2 -- n1 n2 n1 )
- `if`: Begins an if block. Executes the following words if the top number on the stack is non-zero. ( flag -- )
- `else`: Begins an else block. Executes the following words if the top number on the stack is zero. ( -- )
- `then`: Ends an if or else block. ( -- )
- `begin`: Begins a loop block. ( -- )
- `until`: Ends a loop block. Repeats the loop if the top number on the stack is zero. ( flag -- )
- `=`: Compares the top two numbers on the stack. Pushes 1 if they are equal, otherwise pushes 0. ( n1 n2 -- flag )

## Clearing the Stack and Dictionary

- Click the "Clear Stack" button to clear the stack.
- Click the "Clear Dictionary" button to clear all user-defined words from the dictionary.

## Help

Click on any built-in command in the dictionary to see its help information in the help div.

## License

This project is licensed under the MIT License.