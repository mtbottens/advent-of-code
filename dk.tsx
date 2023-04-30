import React, {useState} from "react";
import { render, Box, Text, useFocus } from "ink";
import SelectObj from "ink-select-input";
const {default: Select} = SelectObj

enum AppStep {
  InitialLoad = 'initial_load',
  Choose = 'choose',
  Running = 'running',
};

const App = () => {
  const [step, setStep] = useState(AppStep.InitialLoad);

  function render() {
    switch (step) {
      case AppStep.InitialLoad:
        return null;
      case AppStep.Choose:
        break;
      case AppStep.Running:
        break;
    }
  }

  return render();
};

const Focus = () => (
  <Box flexDirection="column" padding={1}>
    <Box marginBottom={1}>
      <Text>
        Press Tab to focus next element, Shift+Tab to focus previous element,
        Esc to reset focus.
      </Text>
    </Box>
    <Item label="First" />
    <Item label="Second" />
    <Item label="Third" />
    <Select 
      items={
        [
          {value: "hi", label: "What"},
          {value: "hi2", label: "the"},
          {value: "hi3", label: "Fuck"},
        ]
      }
    />
  </Box>
);

const Item = ({label}) => {
  const {isFocused} = useFocus();
  return (
    <Text>
      {label} {isFocused && <Text color="green">(focused)</Text>}
    </Text>
  );
};

render(<App />)