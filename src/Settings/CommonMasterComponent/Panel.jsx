// src/components/forms/Panel.jsx

import { styles } from '../../Style/formStyles';
import PanelHeader from './PanelHeader';

const Panel = ({ title, children, onHelp }) => (
    <div style={styles.panel}>
        <PanelHeader title={title} onHelp={onHelp} />
        <div style={styles.panelBody}>
            {children}
        </div>
    </div>
);

export default Panel;