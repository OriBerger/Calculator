const display = document.getElementById("display");

document.querySelectorAll(".digit").forEach((button) => {
  button.addEventListener("click", () => {
    handleDigit(button.textContent);
    updateDisplay();
  });
});
document.querySelectorAll(".operator").forEach((button) => {
  button.addEventListener("click", () => {
    handleOperator(button.textContent);
    updateDisplay();
  });
});
document.getElementById("reset").addEventListener("click", () => {
  handleReset();
  updateDisplay();
});
document.getElementById("negative").addEventListener("click", () => {
  handleNegative();
  updateDisplay();
});

document.getElementById("percent").addEventListener("click", () => {
  handlePercent();
  updateDisplay();
});
document.getElementById("dot").addEventListener("click", () => {
  handleDot();
  updateDisplay();
});
document.getElementById("equals").addEventListener("click", () => {
  handleEquals();
  updateDisplay();
});

const ERROR_TXT = "Error";
let expToDisplay = "0";
let lastNumber = null;
let lastInput = null;

function handleDigit(digit) {
  if (expToDisplay === ERROR_TXT) {
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
}

function handleOperator(op) {
  if (expToDisplay === ERROR_TXT) {
    return;
  }
  if (
    lastInput &&
    (isOperator(lastInput) || expToDisplay[expToDisplay.length - 1] === ".")
  ) {
    expToDisplay = expToDisplay.slice(0, -1) + op;
  } else {
    expToDisplay += op;
  }
  lastInput = op;
}

function handleReset() {
  expToDisplay = "0";
  lastNumber = null;
  lastInput = null;
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
}

function handlePercent() {
  if (
    expToDisplay === ERROR_TXT ||
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
}

function handleEquals() {
  if (expToDisplay === ERROR_TXT || !lastInput || isOperator(lastInput)) {
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
      expToDisplay = ERROR_TXT;
    }
  } catch (error) {
    expToDisplay = ERROR_TXT;
  }
}

function isDigit(input) {
  return ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(input);
}

function isOperator(input) {
  return ["+", "−", "×", "÷"].includes(input);
}

function updateDisplay() {
  display.textContent = expToDisplay;
}

updateDisplay(); // So the display will be shown at start
