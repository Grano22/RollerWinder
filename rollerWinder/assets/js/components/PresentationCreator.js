import React, {Component} from 'react';
import { PresentationElement, PresentationSlideParentLayout, PresentationDocument, PresentationSlide, GenerateSamplePresentation, PresentationText, PresentationHeader, PresentationTextField, PresentationImage } from '../rollerWinderParser';
import { ActionsStack, ActionOperation, ActionResumeOperation } from '../libs/ActionsStack';
import './PresentationCreator.css';

class PresentationSlideCreateOperation extends ActionOperation {
    name = "Presentation slide create operation";
    description = "User created a slide";

    onStore(component) {
        let newSlide = new PresentationSlide(component.currDocument);
        newSlide.setLayout(new PresentationSlideParentLayout());
        component.currDocument.addSlide(newSlide);
    }

    onRestore() {

    }

    onFlush() {

    }
}

class PresentationSlideDeleteOperation extends ActionOperation {
    name = "Presentation slide delete operation";
    description = "User deleted a slide";

    onStore(component, inputData) {
        component.currDocument.removeSlide(inputData.slideID - 1);
        if(component.state.currSlide>inputData.slideID) return {currSlide:component.state.currSlide-1};
    }

    onRestore() {

    }

    onFlush() {

    }
}

class PresentationElementAddOperation extends ActionOperation {
    name = "Presentation element has been added";
    description = "User added a element";

    onStore(component, inputData) {
        if(typeof inputData.elType!="string") inputData.elType = "";
        let newElReady = null;
        switch(inputData.elType) {
            case "text":
                newElReady = new PresentationText("Sample text");
            break;
            case "header":
                newElReady = new PresentationHeader();
            break;
            case "textField":
                newElReady = new PresentationTextField();
            break;
            case "image":
                newElReady = new PresentationImage();
            break;
            default:
                newElReady = new PresentationElement();
        }
        console.log(newElReady);
        const currSlide = component.currDocument.getSlide(component.state.currSlide - 1);
        currSlide.addElement(newElReady);
    }

    onRestore(component, inputData) {

    }

    onFlush() {

    }
}

class PresentationElementDeleteOperation extends ActionOperation {
    name = "Presentation element was deleted";
    description = "";

    onStore(component, inputData, outputData) {
        inputData.presentationElement.remove();
    }

    onRestore() {

    }

    onFlush() {

    }
}

class PresentationElementSelectOperation extends ActionResumeOperation {
    name = "Presentation element was selected";
    description = "";

    

    onStore(component) {

    }
}

class PresentationCreator extends Component {
    constructor(props) {
        super(props);
        this.currDocumentID = this.props.match.params.documentID;
        this.currDocument = GenerateSamplePresentation();
        this.currDocument.editable = true;
        this.state = {
            currMenu: 0,
            currSlide: 1
        };
        this.actions = new ActionsStack(this);
        this.actions.setOperationsNamespace([PresentationSlideCreateOperation, PresentationSlideDeleteOperation, PresentationElementAddOperation, PresentationElementDeleteOperation]);
        this.chooseNewItem = this.chooseNewItem.bind(this);
        this.addSlideEntry = this.addSlideEntry.bind(this);
    }
    
    componentDidMount() {
        console.log(this.currDocument);
    }

    componentDidUpdate(props, newStates) {
        this.actions.resume(actionOp=>actionOp instanceof PresentationElementSelectOperation && actionOp.mark=="presentationElementSelection", false);
    }

    generateProperties() {
        let ref = this;
        const propList = this.currDocument.selectedElement!=null ? this.currDocument.selectedElement.renderAsInteractiveProperties(null, true, (e)=>{
            if(confirm("Jesteś pewien czy usunąć ten element?")) ref.actions.addOperation(new PresentationElementDeleteOperation(), {
                presentationElement: this.currDocument.selectedElement
            });
        }) : [(<p>Select object to see properties</p>)];
        return (<div className="centred">{propList}</div>);
    }

    generateSlidesList() {
        let iter = 0;
        const slidesMap = this.currDocument.getSlides().map(SlideEntry=>{
            iter++;
            return (
                <li className={iter==this.state.currSlide ? "selected" : ""} key={iter} data-index={iter} onClick={(e)=>this.selectSlideEntry(e)}>
                    <strong>Slajd {iter}</strong>
                    <span className="deleteSlideOperation" onClick={(e)=>this.removeSlideEntry(e)}><i className="fas fa-times"></i></span>
                </li>
            )
        });
        return slidesMap;
    }

    generateTreeElements() {
        let treeMap = [], slidesList = this.currDocument.getSlides(), ref = this;
        let elems = [];
        if(typeof slidesList[this.state.currSlide - 1]!="undefined") {
            treeMap.push((<li><span className="caret" onClick={(e)=>this.toggleCaret(e)}>Ten slajd</span><ul className="nested optionsList"><li onClick={e=>{

            }}>Wybierz</li></ul></li>));
            let currLayouts = slidesList[this.state.currSlide - 1].layout;
            if(currLayouts.length>0) {
                
                const elem = currLayouts.getElements();
                for(let i = 0;i<elem.length;i++) {
                    elems.push((<li><span className="caret" onClick={(e)=>this.toggleCaret(e)}>{elem[i].constructor.name}</span><ul className="nested optionsList"><li onClick={e=>{
                        elem[i].select();
                    }}>Wybierz</li><li onClick={e=>{
                        if(confirm("Usunąć element z prezentacji?")) {
                            ref.actions.addOperation(new PresentationElementDeleteOperation(), {
                                presentationElement:elem[i]
                            });
                            //elem[i].remove(); 
                        } 
                    }}>Usuń</li></ul></li>));
                }
            }
        treeMap.push((<li><span className="caret" onClick={(e)=>this.toggleCaret(e)}>Parent Layout</span><ul className="nested">{elems}</ul></li>));
        }
        return treeMap;
    }

    chooseNewItem(evt) {
        let tgEl = evt.target;
        if(tgEl.tagName!="LI") return false;
        console.log(tgEl);
        for(let elPar in tgEl.parentElement.children) {
            if(!isNaN(elPar) && tgEl==tgEl.parentElement.children[elPar]) {
                console.log(elPar);
                const elTypes = ["text", "header", "textField", "image"];
                this.actions.addOperation(new PresentationElementAddOperation(), {
                    elType: elTypes[parseInt(elPar)]
                });
            }
        }
    }

    changeNavMenu(evt) {
        let tgEl = evt.target;
        if(tgEl.tagName!="SPAN") return false;
        if(tgEl.classList.contains("selected")) return false;
        for(let elPar in tgEl.parentElement.children) {
            if(!isNaN(elPar) && tgEl.parentElement.children[elPar].classList.contains("selected")) {
                tgEl.parentElement.children[elPar].classList.remove("selected");
            }
        }
        tgEl.classList.add("selected");
        this.setState({currMenu: parseInt(tgEl.getAttribute("data-index") - 1)});
    }

    addSlideEntry() {
        this.actions.addOperation(new PresentationSlideCreateOperation());
        console.log(this.actions);
    }

    removeSlideEntry(evt) {
        evt.stopPropagation();
        let newInd = parseInt(evt.currentTarget.parentElement.getAttribute("data-index"));
        if(this.state.currSlide==newInd) return false;
        this.actions.addOperation(new PresentationSlideDeleteOperation(), {
            slideID: newInd
        });
    }

    selectSlideEntry(evt) {
        let newInd = parseInt(evt.currentTarget.getAttribute("data-index"));
        if(newInd!=this.state.currSlide) { 
            if(evt.currentTarget.children[this.state.currSlide] && evt.currentTarget.children[this.state.currSlide].classList.contains("selected")) evt.currentTarget.children[this.state.currSlide].classList.remove("selected");
            this.setState({currSlide:newInd});
            evt.currentTarget.classList.add("selected");
        }
    }

    toggleCaret(evt) {
        let caretEl = evt.currentTarget;
        caretEl.parentElement.children[1].classList.toggle("active");
        caretEl.classList.toggle("caret-down");
    }

    render() {
        const menuContents = [
            (
                <div className="in">
                    <h3>Zarządzaj slajdami</h3>
                    <div className="toolBox"><span className="smallIcon" onClick={this.addSlideEntry}><i className="fas fa-plus"></i></span></div>
                    <ul id="toolboxSlidesList">
                        {this.generateSlidesList()}
                    </ul>
                </div>
            ),
            (
                <div>
                    <h3>Dodawaj nowe elementy</h3>
                    <ul id="toolboxElementsNamespaceList" onClick={(e)=>this.chooseNewItem(e)}>
                        <li><i className="fas fa-paragraph"></i> Tekst</li>
                        <li><i>T</i> Tytuł</li>
                        <li><i className="fas fa-heading"></i> Nagłówek</li>
                        <li><i className="fas fa-image"></i> Grafika</li>
                        <li><i className="fas fa-table"></i> Tabelka</li>
                        <li><i className="fas fa-shapes"></i> Kształt</li>
                    </ul>
                </div>
            ),
            (
                <div>
                    <h3>Drzewo widoku</h3>
                    <ul id="toolboxElementsTree" className="toolbarTreeView">
                        {this.generateTreeElements()}
                    </ul>
                    <h3>Właściwości</h3>
                    <div>
                        {this.generateProperties()}
                    </div>
                </div>
            )
        ]
        /*const menuUI = [
            
        ]*/

        const RenderedView = this.currDocument.getSlide(this.state.currSlide - 1).asComponent();
        return (
            <div id="presentationCreator">
                <aside id="presentationCreator-toolbox">
                    <div className="linearmenu" onClick={e=>this.changeNavMenu(e)}>
                        <span className="menu-item selected" data-index="1"><i className="fab fa-elementor"></i></span>
                        <span className="menu-item" data-index="2"><i className="fas fa-pencil-ruler"></i></span>
                        <span className="menu-item" data-index="3"><i className="fas fa-stream"></i></span>
                    </div>
                    <section className="menucontent">
                        {menuContents[this.state.currMenu]}
                    </section>
                </aside>
                <section id="presentationViewer">
                    <div className="inlineCentredBoth fixedScrollable">
                   <RenderedView/>
                   </div>
                </section>
            </div>
        )
    }
}

export default PresentationCreator;