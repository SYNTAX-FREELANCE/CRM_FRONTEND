// src/components/forms/InputDate.jsx

import { styles } from '../../Style/formStyles';

const InputDate = ({ value, onChange }) => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    return (
        <input
            style={styles.inputDate}
            type="date"
            value={value}
            onChange={onChange}
            max={today}  // Prevents future dates
        />
    );
};

export default InputDate;