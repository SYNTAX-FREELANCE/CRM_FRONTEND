// src/components/forms/Panel.jsx

import { styles } from '../../Style/formStyles';
import PanelHeader from './PanelHeader';

const Panel = ({ title, children, onBack }) => (
    <div style={styles.panel}>
        <PanelHeader title={title} onBack={onBack}/>
        <div style={styles.panelBody}>
            {children}
        </div>
    </div>
);

export default Panel;