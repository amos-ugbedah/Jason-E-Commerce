import React from "react";

export default function CheckoutSteps({ steps, currentStep }) {
  return (
    <nav className="flex items-center justify-center mb-8">
      <ol className="flex items-center space-x-4 w-full max-w-md">
        {steps.map((step, index) => (
          <li key={step.id} className="flex items-center flex-1">
            <div
              className={`flex flex-col items-center ${
                index < currentStep - 1 ? "text-blue-600" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index < currentStep - 1
                    ? "bg-blue-100"
                    : index === currentStep - 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {index < currentStep - 1 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={`text-xs mt-2 ${
                  index === currentStep - 1 ? "font-medium text-blue-600" : ""
                }`}
              >
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-px mx-4 ${
                  index < currentStep - 1 ? "bg-blue-600" : "bg-gray-200"
                }`}
              ></div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
