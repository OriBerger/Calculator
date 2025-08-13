const display = document.getElementById("display");
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const resetButton = document.getElementById("reset");
const negativeButton = document.getElementById("negative");
const percentButton = document.getElementById("percent");
const dotButton = document.getElementById("dot");
const equalsButton = document.getElementById("equals");

numberButtons.forEach((button) => {
  button.addEventListener("click", () => handleDigit(button.textContent));
});
operatorButtons.forEach((button) => {
  button.addEventListener("click", () => handleOperator(button.textContent));
});
dotButton.addEventListener("click", () => handleDot());
resetButton.addEventListener("click", () => handleReset());
negativeButton.addEventListener("click", () => handleNegative());
percentButton.addEventListener("click", () => handlePercent());
equalsButton.addEventListener("click", () => handleEquals());

let expToDisplay = "0";
let lastNumber = null;
let lastInput = null;

function isDigit(input) {
  return ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(input);
}

function isOperator(input) {
  return ["+", "−", "×", "÷"].includes(input);
}

function updateDisplay() {
  display.textContent = expToDisplay;
}

function handleDigit(digit) {
  if (expToDisplay === "Error") {
    return;
  }
  if (expToDisplay === "0") {
    expToDisplay = digit;
    lastNumber = digit;
  } else if (lastInput && isOperator(lastInput)) {
    expToDisplay += digit;
    lastNumber = digit;
  } else if (lastNumber && lastNumber.includes("e")) {
    return;
  } else {
    expToDisplay += digit;
    lastNumber += digit;
  }
  lastInput = digit;
  updateDisplay();
}

function handleOperator(op) {
  if (expToDisplay === "Error") {
    return;
  }
  console.log(lastInput);
  console.log(op);
  if (
    lastInput &&
    (isOperator(lastInput) || expToDisplay[expToDisplay.length - 1] === ".")
  ) {
    expToDisplay = expToDisplay.slice(0, -1) + op;
  } else {
    expToDisplay += op;
  }
  lastInput = op;
  updateDisplay();
}

function handleDot() {
  if (!lastNumber) {
    lastNumber = "0.";
    expToDisplay = lastNumber;
  } else if (
    lastInput &&
    isDigit(lastInput) &&
    !lastNumber.includes(".") &&
    !lastNumber.includes("e")
  ) {
    lastNumber += ".";
    expToDisplay += ".";
  } else if (lastInput && isOperator(lastInput)) {
    lastNumber = "0.";
    expToDisplay += lastNumber;
  }
  lastInput = ".";
  updateDisplay();
}

function handleReset() {
  expToDisplay = "0";
  lastNumber = null;
  lastInput = null;
  updateDisplay();
}

function handleNegative() {
  if (!lastNumber || isOperator(lastInput)) {
    return;
  }
  expToDisplay = expToDisplay.slice(0, -lastNumber.length);
  if (!lastNumber.includes("−")) {
    lastNumber = "−" + lastNumber;
  } else {
    lastNumber = lastNumber.replace("−", "");
  }
  expToDisplay += lastNumber;
  updateDisplay();
}

function handlePercent() {
  if (
    expToDisplay === "Error" ||
    (lastInput && isOperator(lastInput)) ||
    !lastNumber
  ) {
    return;
  }
  let isNegative = lastNumber.includes("−");
  expToDisplay = expToDisplay.slice(0, -lastNumber.length);
  if (isNegative) {
    lastNumber = lastNumber.replace("−", "");
  }
  lastNumber = (parseFloat(lastNumber) / 100).toString();
  if (isNegative) {
    lastNumber = "−" + lastNumber;
  }
  expToDisplay += lastNumber;
  updateDisplay();
}

function handleEquals() {
  if (expToDisplay === "Error" || !lastInput || isOperator(lastInput)) {
    return;
  }
  try {
    let result = expToDisplay
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−−/g, "+") // Handling eval issues
      .replace(/−/g, "-");
    result = eval(result);
    expToDisplay = result.toString();
    expToDisplay = expToDisplay.replace(/-/g, "−");
    lastNumber = expToDisplay;
    lastInput = null;
    if (
      expToDisplay === "NaN" ||
      expToDisplay === "Infinity" ||
      expToDisplay === "−Infinity"
    ) {
      expToDisplay = "Error";
    }
  } catch (error) {
    expToDisplay = "Error";
  }
  updateDisplay();
}

updateDisplay();
