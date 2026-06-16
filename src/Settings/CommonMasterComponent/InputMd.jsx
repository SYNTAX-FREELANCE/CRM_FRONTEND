// src/components/forms/InputMd.jsx

import { styles } from '../../Style/formStyles';

const InputMd = ({ value, onChange, placeholder, maxLength }) => (
    <input
        style={styles.inputMd}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
    />
);

export default InputMd;