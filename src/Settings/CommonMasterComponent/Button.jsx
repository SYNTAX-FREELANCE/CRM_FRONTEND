// src/components/forms/Button.jsx
import { styles } from '../../Style/formStyles';

const Button = ({ onClick, children }) => (
    <button
        style={styles.btn}
        onClick={onClick}
        type="button"
    >
        {children}
    </button>
);

export default Button;