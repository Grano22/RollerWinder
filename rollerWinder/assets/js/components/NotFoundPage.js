import React, {Component} from 'react';
import {withRouter} from 'react-router';

class NotFoundPage extends Component {
    render() {
        return (
            <div>
                <section className="filBoth">
                    <h1>Wpisana strona jest nieprawidłowa</h1>
                </section>
            </div>
        )
    }
}

export default withRouter(NotFoundPage);