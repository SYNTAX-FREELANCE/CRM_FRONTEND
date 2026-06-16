// src/components/forms/SelectLg.jsx

import { styles } from '../../Style/formStyles';

const SelectLg = ({ value, onChange, options }) => (
    <select
        style={styles.selectLg}
        value={value}
        onChange={onChange}
    >
        {options.map((o) => (
            <option key={o} value={o === "-- Select --" ? "" : o}>{o}</option>
        ))}
    </select>
);

export default SelectLg;