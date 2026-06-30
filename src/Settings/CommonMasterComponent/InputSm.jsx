// src/components/forms/InputSm.jsx

import { styles } from '../../Style/formStyles';

const InputSm = ({ value, onChange, placeholder, min, max }) => (
    <input
        style={styles.inputSm}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
    />
);

export default InputSm;