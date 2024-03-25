import React from "react";
import CalButtons from "../data/calculator-bonus-03-button-data";
import { useState } from "react";
import "../styles/style.css";

function Main() {
  const [memory, setMemory] = useState("");
  const [memoryValue, setMemoryValue] = useState(0);
  const [pusheButton, setPusheButton] = useState("");
  const [input, setInput] = useState("");
  const [display, setDisplay] = useState("");
  const [lastOperationWasEquals, setLastOperationWasEquals] = useState(false);

  const operation = ["+", "/", "-", "*"];

  //This function formats the operation signs to be user friendly
  function formatOperation(operation) {
    if (typeof operation !== "string") {
      // Safely handle non-string inputs; you might want to handle this differently
      console.error(
        "formatOperation was passed a non-string argument",
        operation
      );
      return operation;
    }

    return operation.replace(/\*/g, "×").replace(/\//g, "÷");
  }

  // This function checks if the expression includes division by zero
  function checkDivisionByZero(expression) {
    // This regex looks for division operators followed by a zero, possibly surrounded by spaces
    const divisionByZeroRegex = /\/\s*0+/;
    return divisionByZeroRegex.test(expression);
  }

  function toggleSign(currentInput) {
    // Check if the input is not empty or a non-numeric value
    if (currentInput && !isNaN(currentInput)) {
      let num = parseFloat(currentInput);
      num = num * -1;
      return num.toString();
    } else {
      // If the input is empty or non-numeric, return it as is
      return currentInput;
    }
  }

  function calculatePercentage(currentInput) {
    let num = parseFloat(currentInput);
    num = num / 100;
    return num.toString();
  }

  function calculateSquareRoot(currentInput) {
    if (isNaN(currentInput) || parseFloat(currentInput) < 0) {
      return "Error"; // Return error on invalid input
    }
    const num = parseFloat(currentInput);
    return Math.sqrt(num).toString();
  }

  const handleButtonClick = (newPushedButton) => {
    if (
      lastOperationWasEquals &&
      !isNaN(newPushedButton) &&
      !operation.includes(newPushedButton)
    ) {
      setLastOperationWasEquals(false); // Reset the flag
      // Reset input when a number is pressed after equals
      setInput(newPushedButton);
      setDisplay(newPushedButton); // Update display directly for a number

      console.log("newPushedButton", newPushedButton);
    } else {
      setPusheButton(newPushedButton);
      setLastOperationWasEquals(false);

      if (newPushedButton === "=") {
        try {
          let newResult = eval(input);
          // console.log("input", input);

          if (checkDivisionByZero(input)) {
            setInput("Error");
            setDisplay("Error");
          } else {
            setInput(newResult.toString());
            // Update display with formatted result
            setDisplay(formatOperation(newResult.toString()));
           // console.log("result", newResult); //////////////
          }
        } catch (error) {
          setInput("Error");
          setDisplay("Error");
        }
        setLastOperationWasEquals(true);
        setPusheButton(newPushedButton);

      //  console.log("newpushedbutton =", newPushedButton);
      } else if (newPushedButton === "Memory Save") {
        setMemory("m");
        setMemoryValue(input);
        console.log("Memory save", input);
      } else if (newPushedButton === "Memory Clear") {
        setMemory(null);
        setMemoryValue(0);
      } else if (newPushedButton === "Memory Recall") {
        if (memoryValue != null) {
          setMemory("mr");
          setInput(memoryValue.toString());
          setDisplay(formatOperation(memoryValue.toString())); // Update display here
        }
      } else if (newPushedButton === "Memory Subtract") {
        if (memoryValue != null) {
          setMemory("m-");
          let result = (input - memoryValue).toString();
          setInput(result);
          console.log("result from memory substraction", result);
          setDisplay(formatOperation(result)); // Update display here
        }
      } else if (newPushedButton === "Memory Addition") {
        if (memoryValue != null) {
          setMemory("m+");
          let num1 = parseFloat(memoryValue);
          let num2 = parseFloat(input);
          let result = num1 + num2;
          setInput(result.toString());
        //  console.log("result from memory addition", result);
          setDisplay(formatOperation(result.toString())); // Update display here
        }
      } else if (newPushedButton === "All Clear") {
        setInput("");
        setDisplay("");
        // setMemory("");
        // setMemoryValue(null);
      } else if (newPushedButton === "Clear") {
        if (pusheButton !== "=") {
          let newInput = input.substring(0, input.length - 1);
          setInput(newInput);
          setDisplay(formatOperation(newInput));
        } else {
          setInput("");
          setDisplay("");
        }
      } else if (newPushedButton === "+/-") {
        let newInput = toggleSign(input);
        setInput(newInput);
        setDisplay(formatOperation(newInput));
      } else if (newPushedButton === "Percent") {
        // Call calculatePercentage function with current input and update the display
        let newInput = calculatePercentage(input);
        setInput(newInput);
        setDisplay(newInput);
      } else if (newPushedButton === "Square Root") {
        let newInput = calculateSquareRoot(input);
        setInput(newInput);
        setDisplay(newInput); // You might want to format this as well
      } else {
        // Handle an operator following another operator
        if (
          operation.includes(pusheButton) &&
          operation.includes(newPushedButton)
        ) {
          let newInput = input.slice(0, -1) + newPushedButton;
          setInput(newInput);
          setDisplay(formatOperation(newInput)); // Update display with formatted operation
        }
        // Handle a new number or operator after a number or at start
        else {
          setInput((prevInput) => {
            const updatedInput =
              prevInput === "0"
                ? newPushedButton.toString()
                : prevInput + newPushedButton.toString();
            setDisplay(formatOperation(updatedInput)); // Format and update display
            return updatedInput;
          });
        }
      }
    }
  };

  return (
    <div id="wrapper">
      <p>React Calculator</p>
      <div className="displayScreen">
        <div>
          <span className="memory">{memory}</span>
        </div>
        <div>
          <span className="input">{display}</span>
        </div>
      </div>
      <div id="allButtons">
        {CalButtons.map((button, i) => (
          <li
            className={button.className}
            key={i}
            onClick={() => handleButtonClick(button.value)}
          >
            {button.text}
          </li>
        ))}
      </div>
    </div>
  );
}

export default Main;
