// src/components/forms/FormRow.jsx
import React from "react";
import { styles } from '../../Style/formStyles';

const FormRow = ({ label, required, children }) => (
    <div style={styles.formRow}>
        <div style={styles.label}>
            {label}{required && <span style={styles.req}>*</span>}
        </div>
        <div style={styles.colon}>:</div>
        <div style={styles.ctrl}>{children}</div>
    </div>
);

export default FormRow;