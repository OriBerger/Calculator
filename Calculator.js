const display = document.getElementById("display");
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const resetButton = document.getElementById("reset");
const negativeButton = document.getElementById("negative");
const percentButton = document.getElementById("percent");
const dotButton = document.getElementById("dot");

// Initialize variables
let currentInput = "0";
let previousInput = "";
let operator = null;
let justCalculated = false;
let lastOperator = null; // For repeated '='
let lastOperand = null; // For repeated '='

// Update display
function updateDisplay() {
  let value = currentInput;

  if (value === "Infinity" || value === "-Infinity") {
    value = "Overflow";
  }

  // Handle very small decimals
  if (
    !isNaN(value) &&
    Math.abs(parseFloat(value)) < 0.0000001 &&
    parseFloat(value) !== 0
  ) {
    value = parseFloat(value).toExponential(6);
  }

  // Auto scientific notation if too long
  if (value.length > 17 && !isNaN(value)) {
    value = parseFloat(value).toExponential(6);
  }

  // Auto font-size scaling
  if (value.length > 11 && value !== "Error" && value !== "Overflow") {
    display.style.fontSize = "2rem"; // Shrink font
  }
  if (value.length <= 11) {
    display.style.fontSize = "3rem"; // Reset to normal size
  }

  display.textContent = value;
}

// Handle number clicks
numberButtons.forEach((button) => {
  button.addEventListener("click", () => handleNumber(button.textContent));
});

// Handle operator clicks
operatorButtons.forEach((button) => {
  button.addEventListener("click", () => handleOperator(button.textContent));
});

// Handle decimal dot
dotButton.addEventListener("click", () => {
  if (!currentInput.includes(".")) {
    // Only add dot if not already present
    currentInput += ".";
    updateDisplay();
  }
});

// Handle AC (reset)
resetButton.addEventListener("click", () => {
  currentInput = "0";
  previousInput = "";
  operator = null;
  justCalculated = false;
  updateDisplay();
});

// Handle +/- (negative)
negativeButton.addEventListener("click", () => {
  if (currentInput !== "0") {
    currentInput = currentInput.startsWith("-")
      ? currentInput.slice(1) // Remove negative sign
      : "-" + currentInput; // Add negative sign
    updateDisplay();
  }
});

// Handle % (percent)
percentButton.addEventListener("click", () => {
  let num = parseFloat(currentInput);

  if (previousInput && operator) {
    // Convert current number to percentage of previous input
    num = parseFloat(previousInput) * (num / 100);
    currentInput = num.toString();
  } else {
    // Default behavior: divide by 100
    currentInput = (num / 100).toString();
  }
  updateDisplay();
});

function handleNumber(val) {
  if (justCalculated) {
    // If just calculated, reset current input to zero
    currentInput = "0";
    justCalculated = false;
  }
  if (currentInput === "0" && val !== ".") {
    currentInput = val; // Replace initial zero, if there is a dot, it will be added
  } else {
    currentInput += val;
  }
  updateDisplay();
}

function handleOperator(op) {
  if (op === "=") {
    // First '='
    if (operator && previousInput !== "") {
      // Save last operation for repeated '='
      lastOperator = operator;
      lastOperand = currentInput; // the second number

      currentInput = calculate(previousInput, currentInput, operator);
      previousInput = "";
      operator = null;
      justCalculated = true;
      updateDisplay();
      return;
    }

    // Repeated '='
    if (lastOperator && lastOperand !== null) {
      currentInput = calculate(currentInput, lastOperand, lastOperator);
      updateDisplay();
      justCalculated = true;
    }

    return;
  }

  // Handle repeated operator presses (like + - * /)
  if (justCalculated) {
    justCalculated = false;
  }

  // If user presses operator twice without entering new number
  if (operator && currentInput === "0" && previousInput !== "") {
    // Just replace the operator (ignore repeated input)
    operator = op;
    return; // Do nothing else
  }

  // Normal behavior: chain calculation if operator already set
  if (operator && previousInput !== "") {
    currentInput = calculate(previousInput, currentInput, operator);
    updateDisplay();
  }

  // Set new operator and prepare for next number
  operator = op;
  previousInput = currentInput;
  currentInput = "0";
}

// Calculation function
function calculate(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);

  switch (op) {
    case "+":
      return (a + b).toString();
    case "−":
      return (a - b).toString();
    case "×":
      return (a * b).toString();
    case "÷":
      return b === 0 ? "Error" : (a / b).toString();
    default: // if no operator(null, undefined, symbol), just return b
      return b.toString();
  }
}

// Initial display update
updateDisplay();
