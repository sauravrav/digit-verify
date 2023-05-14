import {  useRef, useEffect, useState } from 'react';

function Verify() {
  const inputRefs = useRef([]);
  const [errorStat, setErrorStat] = useState({
    hasError: false,
    errorMessage: '',
  })

  const handleInput = (index, event) => {
    const input = event.target;
    const value = input.value;
    // Check if input value is numeric, and set error state accordingly
    if (isNaN(value)) {
      setErrorStat({ ...errorStat, hasError: true, errorMessage:'Please fill numeric value only' });// Add red border to input field
    } else {
      setErrorStat({ ...errorStat, hasError: false });// Add red border to input field
      // Move focus to next input field if current one is not empty
      if (value !== "" && index < inputRefs.current.length - 1 ) {
        inputRefs.current[index + 1].focus();
      }
    }
    // Limit input value to first 5 characters if pasted value is longer than 6 characters
    if (value.length > 1 && event.type === 'paste') {
      input.value = value.substring(0, 1);
    }
  };

  const handleBackspace = (index, event) => {
    const input = event.target;
    const value = input.value;

    // Delete previous input field if current one is empty
    if (value === "" && index > 0) {
      inputRefs.current[index - 1].value = "";
      inputRefs.current[index - 1].focus();
    }
  };
  
  const handlePaste = (event) => {
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData("text");
  
    // Iterate over first 6 characters and paste into input fields
    for (let i = 0; i < 6 && i < pastedData.length; i++) {
      const value = pastedData[i];
      if (isNaN(value)) {
        setErrorStat({ ...errorStat, hasError: true, errorMessage:'Please paste string with numeric values only' });// Add red border to input field
        inputRefs.current[i].value = value;
        inputRefs.current[i].classList.add("border-red-500");;
        break;
      } else {
        inputRefs.current[i].value = value;
        inputRefs.current[i].classList.remove("border-red-500");
      }
    }
  
    // Move focus to first input field
    inputRefs.current[0].focus();
  
    // Prevent default paste behavior
    event.preventDefault();
  };

  const handleSubmit = () => {
    
  }

  useEffect(() => {
    // Set focus to first input field when component mounts
    inputRefs.current[0].focus();
  }, []);

return (
  <div className="flex justify-center items-center h-screen">
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-8">VERIFICATION CODE:</h1>
      <div className="flex justify-center mb-8">
        {[...Array(6)].map((_, index) => (
          <input
            type="text"
            key={index}
            maxLength="1"
            ref={(el) => (inputRefs.current[index] = el)}
            className={`w-10 h-10 mr-2 border-gray-400 border rounded text-center focus:outline-none ${errorStat.hasError && isNaN(inputRefs.current[index].value) ? "border-red-500" : ""}`}
            onChange={(event) => handleInput(index, event)}
            onKeyDown={(event) => {
              if (event.key === "Backspace") handleBackspace(index, event);
            }}
            onPaste={handlePaste}
          />
        ))}
      </div>
      {errorStat.hasError && (
        <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <span className="block sm:inline">{errorStat.errorMessage}</span>
        </div>
      )}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
    </div>
  </div>
);
}

export default Verify;
