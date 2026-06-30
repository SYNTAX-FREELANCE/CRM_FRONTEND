import { styles } from '../../Style/formStyles';

const Checkbox = ({ value, onChange, label }) => {
    const isChecked = value === "Active";

    return (
        <div style={styles.checkboxContainer}>
            <input
                type="checkbox"
                id="isActive"
                checked={isChecked}
                onChange={(e) => {
                    onChange({
                        target: { value: e.target.checked ? "Active" : "Inactive" }
                    });
                }}
                style={styles.checkbox}
            />
            {label && <span style={styles.checkboxLabel}>{label}</span>}
            <span style={{
                ...styles.checkboxText,
                color: isChecked ? '#4CAF50' : '#F44336',
                fontWeight: isChecked ? 600 : 400
            }}>
                {isChecked ? "Active" : "Inactive"}
            </span>
        </div>
    );
};

export default Checkbox;