import React, {Component} from 'react';
import {withRouter} from 'react-router';
import RollerViewer from '../elements/RollerViewer';

class PresentationView extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <div className="inside">
                <h1>Obejrzyj prezentację</h1>
                <RollerViewer timeSet="2" />
                </div>
            </div>
        )
    }
}

export default PresentationView;