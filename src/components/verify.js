import {  useRef, useEffect } from 'react';

function Verify() {
  const inputRefs = useRef([]);

  const handleInput = (index, event) => {
    const input = event.target;
    const value = input.value;

    // Move focus to next input field if current one is not empty
    if (value !== "" && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
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
      inputRefs.current[i].value = pastedData[i];
    }
  
    // Move focus to first input field
    inputRefs.current[5].focus();
  
    // Prevent default paste behavior
    event.preventDefault();
  };

  const handleSubmit = async () => {
    const response = await fetch('/api/verify', {
      method: 'POST',
      body: JSON.stringify({ code }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      // redirect to success page on success
      window.location.href = '/success';
    } else {
      // display error message on error
      alert('Verification Error');
    }
  };

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
                className="w-10 h-10 mr-2 border-gray-400 border rounded text-center focus:outline-none focus:border-blue-500 "
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(event) => handleInput(index, event)}
                onKeyDown={(event) => {
                  if (event.key === "Backspace") handleBackspace(index, event);
                }}
                onPaste={handlePaste}
              />
            ))}
        </div>
        <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Submit
        </button>
      </div>
    </div>
  );
}

export default Verify;
