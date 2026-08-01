// src/components/forms/InputLg.jsx

import { styles } from "../../Style/formStyles";

const InputLg = ({
    value,
    type = "text",
    onChange,
    placeholder,
    ...props
}) => (
    <input
        style={styles.inputLg}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
    />
);

export default InputLg;