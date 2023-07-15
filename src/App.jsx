import React, { useState, useEffect } from "react";
import { INPUT_ONE, INPUT_TWO, units } from "./constants";
import "./styles.css";

const UnitSelector = ({ value, onChange }) => {
  return (
    <select value={value} onChange={onChange} className="unit-selector">
      {units.map((unit) => (
        <option key={unit} value={unit}>
          {unit}
        </option>
      ))}
    </select>
  );
};

const UserInputField = ({ id, value, onChange, unitValue, onUnitChange }) => {
  return (
    <div id={id} className="user-input-field">
      <input
        type="number"
        value={value}
        onChange={onChange}
        className="text-box"
      />
      <UnitSelector value={unitValue} onChange={onUnitChange} />
    </div>
  );
};

const convertUnits = (value, fromUnit, toUnit) => {
  const unitConversions = {
    kilometer: {
      meter: value * 1000,
      centimeter: value * 100000
    },
    meter: {
      kilometer: value / 1000,
      centimeter: value * 100
    },
    centimeter: {
      kilometer: value / 100000,
      meter: value / 100
    }
  };
  return unitConversions[fromUnit][toUnit];
};

const UnitConverter = () => {
  const [userInputData, setUserInputData] = useState({
    [INPUT_ONE]: {
      value: undefined,
      unit: "kilometer"
    },
    [INPUT_TWO]: {
      value: undefined,
      unit: "meter"
    }
  });

  const handleInputChange = (e, inputType) => {
    const { value } = e.target;
    const inputOneUnit =
      inputType === INPUT_ONE
        ? userInputData[INPUT_ONE].unit
        : userInputData[INPUT_TWO].unit;
    const inputTwoUnit =
      inputType === INPUT_ONE
        ? userInputData[INPUT_TWO].unit
        : userInputData[INPUT_ONE].unit;
    const inputTwoValue = convertUnits(value, inputOneUnit, inputTwoUnit);
    setUserInputData((prevValues) => ({
      ...prevValues,
      [inputType]: {
        value,
        unit: prevValues[inputType].unit
      },
      [inputType === INPUT_ONE ? INPUT_TWO : INPUT_ONE]: {
        value: inputTwoValue,
        unit: prevValues[inputType === INPUT_ONE ? INPUT_TWO : INPUT_ONE].unit
      }
    }));
  };

  const handleUnitChange = (e, inputType) => {
    const { value } = e.target;
    const otherInpuType = inputType === INPUT_ONE ? INPUT_TWO : INPUT_ONE;
    if (userInputData[otherInpuType].unit === value) {
      // Swap the units as the user is trying to select the same unit.
      setUserInputData((prevValues) => ({
        ...prevValues,
        [inputType]: {
          value: prevValues[inputType].value,
          unit: value
        },
        [otherInpuType]: {
          value: prevValues[otherInpuType].value,
          unit: prevValues[inputType].unit
        }
      }));
    } else {
      setUserInputData((prevValues) => ({
        ...prevValues,
        [inputType]: {
          ...prevValues[inputType],
          unit: value
        }
      }));
    }
  };

  useEffect(() => {
    setUserInputData((prevValues) => ({
      ...prevValues,
      [INPUT_TWO]: {
        value: convertUnits(
          prevValues[INPUT_ONE].value,
          prevValues[INPUT_ONE].unit,
          prevValues[INPUT_TWO].unit
        ),
        unit: prevValues[INPUT_TWO].unit
      }
    }));
  }, [userInputData.input1.unit, userInputData.input2.unit]);

  return (
    <div className="main-container">
      <h2>Unit Converter</h2>
      <div className="input-container">
        <UserInputField
          id={INPUT_ONE}
          value={userInputData[INPUT_ONE].value}
          onChange={(e) => handleInputChange(e, INPUT_ONE)}
          unitValue={userInputData[INPUT_ONE].unit}
          onUnitChange={(e) => handleUnitChange(e, INPUT_ONE)}
        />
        <div className="equal-sign"> = </div>
        <UserInputField
          id={INPUT_TWO}
          value={userInputData[INPUT_TWO].value}
          onChange={(e) => handleInputChange(e, INPUT_TWO)}
          unitValue={userInputData[INPUT_TWO].unit}
          onUnitChange={(e) => handleUnitChange(e, INPUT_TWO)}
        />
      </div>
    </div>
  );
};

export default UnitConverter;
