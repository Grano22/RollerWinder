import React, {Component} from 'react';
import mainLogo from '../../img/rollerSliderLogo.png';
import {Route, Switch,Redirect, Link, withRouter, NavLink} from 'react-router-dom';
import HomePage from './HomePage';
import SlideshowExplorer from './SlideshowExplorer';
import SlideshowCreationManager from './SlideshowCreationManager';
import NotFoundPage from './NotFoundPage';
import PresentationView from './PresentationView';
import PresentationCreator from './PresentationCreator';

class Home extends Component {
    constructor() {
        super();
        //this.openMenu = this.openMenu.bind(this);
    }

    toggleMenu(evt) {
        let thisEl = evt.currentTarget, containerTarget = document.getElementById("container");
        if(thisEl.classList.contains("active")) {
            thisEl.classList.remove("active");
            thisEl.classList.add("not-active");
            containerTarget.classList.remove("navmenuActive");
        } else {
            thisEl.classList.remove("not-active");
            thisEl.classList.add("active");
            containerTarget.classList.add("navmenuActive");
        }
    }

    closeMenu() {
        let thisEl = document.getElementById("menuIconLive"), containerTarget = document.getElementById("container");
        if(thisEl.classList.contains("active")) {
            thisEl.classList.remove("active");
            thisEl.classList.add("not-active");
            containerTarget.classList.remove("navmenuActive");
        }
    }

    render() {
        return (
            <div>
            <div id="container">
            <nav id="navbar">
                <ul id="navbar-actions" className="desktop">
                    <Link to={`/addPresentation`}><i className="fas fa-plus"></i></Link>
                    <Link to={`/presentationList`}><i className="fas fa-th"></i></Link>
                </ul>
                <div id="navbar-logo">
                <Link to={`/`}><img src={mainLogo} alt="rollerWinder logo" width="64" height="64" /></Link>
                </div>
                <div id="navbar-context">
                <div id="menuIconLive" onClick={e=>this.toggleMenu(e)}>
                    <div className="menuHamicon">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                </div>
            </nav>
            <main id="mainContainer">
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route path="/createPresentation" component={PresentationCreator} />
                    <Route path="/createCarousel" component={PresentationCreator} />
                    <Route path="/presentationList" component={SlideshowExplorer} />
                    <Route path="/addPresentation" component={SlideshowCreationManager} />
                    <Route path="/viewPresentation/:presentationID" component={PresentationView} />
                    <Route path="/oops" component={NotFoundPage} />
                    <Redirect to="/oops" />
                </Switch>
            </main>
            <footer id="footerContainer">
                <div className="fixedInner">
                <section className="footerSection">
                    <div className="in">
                        <h3>O aplikacji</h3>
                        <hr/>
                        <p>Aplikacja <strong>Roller Winder</strong> służy do tworzenia/importowania/przeglądania prezentacji multimedialnych. Także pozwala łatwo i szybko je udostępniać za pomocą unikatowego linku.</p>
                    </div>
                </section>
                <section className="footerSection">
                        <div className="in">
                        <h3>Nawigacja</h3>
                        <hr/>
                        <ul className="linksList">
                            <Link to={SlideshowCreationManager}>Stwórz prezentację</Link>
                            <a className="anchor">Przewiń na samą górę</a>
                        </ul>
                        </div>
                </section>
                <section className="footerSection">
                    <h3>Kontakt</h3>
                    <hr/>
                    <div>

                    </div>
                </section>
                </div>
            </footer>
            <div id="foot">Grano22 Dev &copy; 2020</div>
            </div>
            <div id="navmenu">
                <ul onClick={(ev)=>{if(ev.target.tagName!="UL") return this.closeMenu();}}>
                    <NavLink className="mobile" to={`/addPresentation`}><i className="fas fa-plus"></i> Dodaj prezentację</NavLink>
                    <NavLink className="mobile" to={`/presentationList`}><i className="fas fa-th"></i> Galeria prezentacji</NavLink>
                    <a><i className="fas fa-times"></i> Zamknij menu</a>
                </ul>
            </div>
            </div>
        )
    }

}

export default Home;