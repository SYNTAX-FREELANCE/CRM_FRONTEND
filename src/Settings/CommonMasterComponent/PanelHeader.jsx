// src/components/forms/PanelHeader.jsx
import { styles } from '../../Style/formStyles';
import { useNavigate } from 'react-router-dom';
import HelpIcon from '@mui/icons-material/Help';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const PanelHeader = ({ title, onHelp, onBack }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    return (
        <div style={styles.panelHeader} role="banner">
            <span>{title}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    style={styles.helpBtn}
                    title="Help"
                    onClick={onHelp}
                >
                    <HelpIcon style={{ fontSize: '20px' }} />
                </button>
                <button
                    style={styles.backBtn}
                    title="Go Back"
                    onClick={handleBack}
                >
                    <ExitToAppIcon style={{ fontSize: '20px' }} />
                </button>
            </div>
        </div>
    );
};

export default PanelHeader;