import { useState } from 'react';
import { Select, SelectOption } from './Select';
const options = [
  { label: 'First', value: 1 },
  { label: 'Second', value: 2 },
  { label: 'Third', value: 3 },
  { label: 'Fourth', value: 4 },
  { label: 'Fifth', value: 5 },
];
const App = () => {
  const [value, setValue] = useState<SelectOption | undefined>(options[0]);
  const [value2, setValue2] = useState<SelectOption[]>([options[0]]);
  return (
    <div>
      <Select options={options} value={value} onChange={(o) => setValue(o)} />
      <br />
      <Select multiple options={options} value={value2} onChange={(o) => setValue2(o)} />
    </div>
  );
};

export default App;
