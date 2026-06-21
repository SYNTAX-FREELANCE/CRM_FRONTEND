// src/components/forms/SelectLg.jsx

import { styles } from '../../Style/formStyles';

const SelectLg = ({
    value,
    onChange,
    options
}) => (
    <select
        style={styles.selectLg}
        value={value}
        onChange={onChange}
    >
        <option value="">-- Select --</option>

        {options.map((item) => (
            <option
                key={item.id}
                value={item.id}
            >
                {item.label}
            </option>
        ))}
    </select>
);

export default SelectLg;