// src/components/forms/InputDate.jsx

import { styles } from '../../Style/formStyles';

const InputDate = ({ value, onChange }) => (
    <input
        style={styles.inputDate}
        type="date"
        value={value}
        onChange={onChange}
    />
);

export default InputDate;