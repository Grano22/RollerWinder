import React, {Component} from 'react';
import {withRouter} from 'react-router';

class SlideshowCreationManager extends Component {
    render() {
        return (
            <div>
                <header>
                    <div className="in">
                    <h1>Stwórz nowy pokaz slajdów</h1>
                    </div>
                </header>
                <section className="lightPeak">
                    <div className="inside">
                    <h2 className="centred">Wybierz działanie</h2><hr className="light"/>
                    <div className="gridBordered">
                        <div className="gridBordered-item">
                            <h4 className="centred">Stwórz pokaz z galerii zdjęć</h4>
                        </div>
                        <div className="gridBordered-item">
                            <h4 className="centred">Utwórz nową prezentację multimedialną</h4>
                        </div>
                        <div className="gridBordered-item">
                            <h4 className="centred">Importuj prezentację z programu PowerPoint</h4>
                        </div>
                    </div>
                    </div>
                </section>
            </div>
        )
    }
}

export default withRouter(SlideshowCreationManager);