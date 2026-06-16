// src/components/forms/InputLg.jsx

import { styles } from '../../Style/formStyles';

const InputLg = ({ value, onChange, placeholder }) => (
    <input
        style={styles.inputLg}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
    />
);

export default InputLg;