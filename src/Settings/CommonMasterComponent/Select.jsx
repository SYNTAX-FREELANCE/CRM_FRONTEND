// src/components/forms/Select.jsx

import { styles } from '../../Style/formStyles';

const Select = ({ value, onChange, options }) => (
    <select
        style={styles.select}
        value={value}
        onChange={onChange}
    >
        {options.map((o) => (
            <option key={o} value={o === "-- Select --" ? "" : o}>{o}</option>
        ))}
    </select>
);

export default Select;