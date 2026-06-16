// src/components/forms/Toast.jsx

import { styles } from '../../Style/formStyles';

const Toast = ({ message, onClose }) => {
    if (!message) return null;
    return (
        <div style={styles.toast} onClick={onClose}>
            {message}
        </div>
    );
};

export default Toast;