import React, {Component, createElement} from 'react';
import ReactDOM from 'react-dom';
import DOMResizer from './libs/DOMResizer.module';
import defaultSrcOfPic from '../img/defaultPic.png';
var createReactClass = require('create-react-class');

export function GenerateSamplePresentation() {
    let currDoc = new PresentationDocument(), newSlide = new PresentationSlide(currDoc), parLayout = new PresentationSlideParentLayout(currDoc);
    currDoc.addSlide(newSlide);
    newSlide.setLayout(parLayout);
    //parLayout.addElement(new PresentationElement(currDoc));
    return currDoc;
}

export function PresentationBuilder(docParams={}) {
    var currDoc = new PresentationDocument();
    for(let presProp in currDoc) {
        if(currDoc.hasOwnProperty(presProp) && typeof docParams[presProp]!="undefined") currDoc[presProp] = docParams[presProp];
    }
    return {
        slides: function(slidesList=[]) {
            for(let i = 0;i<slidesList.length;i++) {
                if(typeof slidesList[i]=="object") {
                    var contextSlide = new PresentationSlide(currDoc);
                    for(let slidProp in contextSlide) {
                        if(contextSlidec.hasOwnProperty(slidProp) && typeof slidesList[i][slidProp]!="undefined") contextSlide[slidProp] = slidesList[i][slidProp];
                    }
                    currDoc.addSlide(contextSlide);
                } else console.error("Required object to slide creation");
            }
            return currDoc;
        }
    }
}

export class RollerWinderParser {

}

export class PresentationDocument {
    ///Metadata
    categories = new Array();
    tags = new Array();
    lastModifiedDate = null;
    creationDate = null;
    lastPrintedDate = null;
    authors = new Array();
    version = "";
    lastRenderedSlide = null;
    selectedElement = null;
    selectedElementEditMode = "";

    ///Display
    orientation = "landscape"; //portrait, landscape
    ratioX = 9;
    ratioY = 16;
    width = 0;
    height = 0;

    ///Memory
    slides = new Array();

    //Editable
    editable = false;
    
    constructor(editable=false) {
        this.editable = editable;
    }

    get length() { return this.slides.length; }

    setResByCalculatedWidth(width, setIt=false) { if(setIt) this.width = width; if(this.orientation=="landscape") this.height = Math.round(width * (this.ratioX/this.ratioY)); else this.height = Math.round(width * (this.ratioY/this.ratioX)); }

    getCalculatedHeightByWidth(width) { let cheight = 0; if(this.orientation=="landscape") cheight = Math.round(width * (this.ratioX/this.ratioY)); else cheight = Math.round(width * (this.ratioY/this.ratioX)); return cheight; }

    addSlide(newSlide) {
        if(newSlide.controller==null) newSlide.controller = this;
        this.slides.push(newSlide);
    }

    getSlides() { return this.slides; }

    getSlide(param, determiner="index") {
        switch(determiner) {
            case "index":
                return this.slides[param];
            break;
            case "id":

            break;
            case "creationID":

            break;
            case "last": return this.slides[this.slides.length - 1];
        }
    }

    removeSlide(param, determiner="index") {
        switch(determiner) {
            case "index":
                this.slides.splice(param, 1);
            break;
            case "id":

            break;
            case "creationID":

            break;
            case "last": this.slides.splice(this.slides.length - 2, this.slides.length - 1);
        }
    }
}

export class PresentationSlide {
    ///controller
    controller = null;
    ///Properties
    layout = new PresentationSlideParentLayout();
    ///Reference
    referenceEl = null;

    constructor(initialController) {
        if(initialController instanceof PresentationDocument) this.controller = initialController; else console.error("PresentiationSlide requiresPresentationDocument as Controller");
    }

    get index() {
        for(let slideOnce in this.controller.slides) { if(this.controller.slides[slideOnce]==this) return slideOnce;  }
    }

    get reference() {
        return this.referenceEl;
    }

    addElement(newEl) { if(this.layout!=null) this.layout.addElement(newEl); }
    removeElement(param) { if(this.layout!=null) this.layout.addElement(param); }

    setLayout(newLayout) {
        if(newLayout instanceof PresentationSlideParentLayout) { if(this.controller!=null) newLayout.controller = this.controller; console.log(newLayout, this.controller); this.layout = newLayout; }
    }

    asComponent() {
        let PrepRend = this.layout.asComponent(), ref = this;
        return createReactClass({
            componentDidMount() {    
                this.currEl = ref.referenceEl; 
                this.currEl.style.height = ref.controller.getCalculatedHeightByWidth(this.currEl.clientWidth) + "px";
                new DOMResizer().onWindowResize(this.currEl, (w)=>{ this.currEl.style.height = ref.controller.getCalculatedHeightByWidth(parseInt(w)) + "px"; }); 
            },
            render() {
                //this.ratioX = ref.controller.ratioX;
                //this.ratioY = ref.controller.ratioY;
                
                 //ref.controller.height if(ref.controller.height>0) 
                ref.controller.lastRenderedSlide = ref;
                return (
                    <div id={ref.index + "Slide"} ref={r=>ref.referenceEl = r} className="presentationSlide"><PrepRend key="0" /></div>
                )
            }
        });
    }

    asNativeElement() {
        let currEl = document.createElement("div");
        currEl.className = "presentationSlide";
        if(this.controller.height>0) currEl.style.height = this.controller.height + "px";
            currEl.appendChild(this.layout.asNativeElement());
        return currEl;
    }

    asHTMLCode() {
        let addonParams = {};
        if(this.controller.height>0) addonParams += ` style="height:${this.controller.height}"`;
        return `<div className="presentationSlide">${this.layout.asHTMLCode()}</div>`;
    }
}

//Slides Layouts
export class PresentationSlideLayout {
    controller = null;
    elements = new Array();

    constructor(initialController=null) {
        if(initialController instanceof PresentationDocument) this.controller = initialController; else console.error("PresentiationElement requires PresentationDocument as Controller");
    }

    addElement(newEl) {
        if(Array.isArray(newEl)) {
            for(let newElOnce in newEl) { newEl[newElOnce].parent = this; if(this.controller!=null) newEl[newElOnce].controller = this.controller; this.elements.push(newEl[newElOnce]); } 
        } else {
            newEl.parent = this;
            if(this.controller!=null) newEl.controller = this.controller;
            this.elements.push(newEl);
        }
    }

    get length() {return this.elements.length;}
    getElements() {return this.elements;}
    removeElement(param) {this.elements.splice(param, 1);}

    getElement() {

    }

    selectElement() {

    } 

    asComponent() {
        const preparedElements = this.elements.map((presEl, ind)=>{
            let PrepRend = presEl.asComponent();
            return (<PrepRend key={ind} />); 
        });
        return createReactClass({
            render() {
                return (
                <div className="presentationSlideLayout">{preparedElements}</div>
                )
            }
        });
    }
}

export class PresentationSlideParentLayout extends PresentationSlideLayout {
    constructor() {
        super();
    }

    asComponent() {
        const preparedElementsAndLayouts = this.elements.map((presEl, ind)=>{
            let PrepRend = presEl.asComponent();
            return (<PrepRend key={ind} />); 
        });
        console.log(this.controller);
        return createReactClass({
            render() {
                return (
                <div className="parentPresentationSlideLayout">{preparedElementsAndLayouts}</div>
                )
            }
        });
    }
}

//Elements

export class PresentationElement {
    controller = null;
    renderedInstance = null;
    renderedEditableClasses = "editableContainer";

    id = 0;
    namespace = "";
    creationID = "";

    posX = 0;
    posY = 0;
    angle = 0;

    layer = 1;
    locked = false;

    parent = null;

    editModes = ["moveable", "rotateable"];
    editModesProps = []; //equalSizeRatio, 
    inheritedAttributes = ["posX", "posY", "angle", "layer", "locked"];

    constructor(initialController=null) {
        if(initialController!=null) { if(initialController instanceof PresentationDocument) this.controller = initialController; else console.error("PresentiationElement requires PresentationDocument as Controller"); }
        var ref = this
        this.editEvents = {
            move:function(ev) {
                if(!ref.locked) {
                let mainCont = ref.controller.lastRenderedSlide.reference;
                ev =  ev || window.event;
                ev.preventDefault();
                let currCont = ev.currentTarget;
                let lastPosY = ev.clientX, lastPosX = ev.clientY, currPosX = 0, currPosY = 0, countedX = 0, countedY = 0;
                const totalX = mainCont.offsetWidth, totalY = mainCont.offsetHeight;
                
                document.onmouseup = function() {
                    document.onmouseup = null;
                    document.onmousemove = null;
                }
                document.onmousemove = function(sevt) {
                    sevt = sevt || window.event;
                    sevt.preventDefault();
                    let currContX = currCont.clientWidth, currContY = currCont.clientHeight;
                    currPosX = sevt.clientX - (currContX/2);
                    currPosY = sevt.clientY - (currContY/2);
                    lastPosX = sevt.clientX;
                    lastPosY = sevt.clientY;
                    let finalX =  currPosX - mainCont.offsetLeft, finalY = currPosY - mainCont.offsetTop;
                    //console.log(finalX, finalY, totalY, totalX);
                    if(totalX - currContX<finalX) {
                        finalX = totalX - currContX;
                    } else if(finalX<0) {
                        finalX = 0;
                    } 
                    if(totalY - currContY<finalY) {
                        finalY = totalY - currContY;
                    } else if(finalY<0) {
                        finalY = 0;
                    }
                    ref.posX = finalX;
                    ref.posY = finalY;
                    ref.updatePosition();
                    /*currCont.style.left = finalX + "px";
                    currCont.style.top = finalY + "px";*/
                }
                }
            },
            rotate:function(ev) {
                if(!ref.locked) {
                let mainCont = ref.controller.lastRenderedSlide.reference;
                ev = ev || window.event;
                let currCont = ev.currentTarget;
                document.onmouseup = function() {
                    document.onmouseup = null;
                    document.onmousemove = null;
                }
                document.onmousemove = function(sevt) {
                    sevt = sevt || window.event;
                    const totalX = mainCont.offsetWidth, totalY = mainCont.offsetHeight;
                    let centerX = currCont.offsetLeft + (currCont.clientWidth/2), centerY = currCont.offsetTop + (currCont.clientHeight/2);
                    let mouseX = sevt.pageX; let mouseY = sevt.pageY;
                    let radians = Math.atan2(mouseX - centerX, mouseY - centerY);
                    console.log(radians);
                    let degree = (radians * (180 / Math.PI) * -3) + 90;
                    console.log(degree);
                    ref.angle = degree;
                    currCont.style.transform = `rotate(${degree}deg)`;
                    
                }
                }
            },
            resizeTopLeft:function(ev) {
                if(!ref.locked) {
                    const mainCont = ref.controller.lastRenderedSlide.reference, thisCont = ref.controller.selectedElement.renderedInstance || ev.currentTarget.parentElement;
                    if(ref.width<=0) ref.width = thisCont.clientWidth;
                    if(ref.height<=0) ref.height = thisCont.clientHeight;
                    const lastWidth = ref.width, lastHeight = ref.height, lastPosX = ref.posX, lastPosY = ref.posY;
                    document.onmouseup = function() {
                        document.onmouseup = null;
                        document.onmousemove = null;
                    }
                    document.onmousemove = function(sevt) {
                        let currCordinates = thisCont.getBoundingClientRect(), newWidth = 0, newHeight = 0, newPosX = 0, newPosY = 0;
                        if(ref.editModesProps.includes("equalSizeRatio")) {
                            let ratio = thisCont.offsetWidth/thisCont.offsetHeight;
                            if(sevt.clientX>thisCont.offsetLeft && sevt.clientX<(mainCont.offsetLeft + mainCont.offsetWidth)) {
                                //sevt.clientX> && sevt.clientX<(thisCont.offsetLeft + thisCont.offsetWidth)
                                let diffY = sevt.clientY - thisCont.offsetTop, diffX = sevt.clientX - thisCont.offsetLeft;
                                if(diffX>diffY) {
                                    newWidth = lastWidth - Math.floor(sevt.pageX - ev.clientX);
                                    newHeight = lastHeight - Math.floor(sevt.pageY - ev.clientY);
                                    newPosX = lastPosX + (sevt.clientX - ev.clientX);
                                    newPosY = lastPosY + (sevt.clientY - ev.clientY);
                                } else {
                                    newWidth = lastWidth - Math.floor(sevt.pageX - ev.clientX);
                                    newHeight = lastHeight - Math.floor(sevt.pageY - ev.clientY);
                                    newPosX = lastPosX + (sevt.clientX - ev.clientX);
                                    newPosY = lastPosY + (sevt.clientY - ev.clientY);
                                }
                            }
                        } else {
                            if(sevt.clientX>thisCont.offsetLeft && sevt.clientX<(mainCont.offsetLeft + mainCont.offsetWidth)) {
                                newWidth = lastWidth - Math.floor(sevt.pageX - ev.clientX);
                                newHeight = lastHeight - Math.floor(sevt.pageY - ev.clientY);
                                newPosX = lastPosX + (sevt.clientX - ev.clientX);
                                newPosY = lastPosY + (sevt.clientY - ev.clientY);
                                if(newWidth>0 && newHeight>0 && newPosX>0 && newPosY>0) { ref.width = newWidth; ref.height = newHeight; ref.posX = newPosX; ref.posY = newPosY; ref.updateSize(); ref.updatePosition(); }
                            }
                        }
                    }
                }
            },
            resizeTopRight:function(ev) {
                if(!this.locked) {
                    const mainCont = ref.controller.lastRenderedSlide.reference, thisCont = ref.controller.selectedElement.renderedInstance || ev.currentTarget.parentElement;
                    if(ref.width<=0) ref.width = thisCont.clientWidth;
                    if(ref.height<=0) ref.height = thisCont.clientHeight;
                    const lastWidth = ref.width, lastHeight = ref.height, lastPosX = ref.posX, lastPosY = ref.posY;
                    document.onmouseup = function() {
                        document.onmouseup = null;
                        document.onmousemove = null;
                    }
                    document.onmousemove = function(sevt) {
                        let currCordinates = thisCont.getBoundingClientRect(), newWidth = 0, newHeight = 0, newPosX = 0, newPosY = 0;
                        console.log(sevt.clientX - (currCordinates.left + thisCont.offsetWidth), currCordinates);
                        if(sevt.clientX<(mainCont.offsetLeft + mainCont.offsetWidth)) {
                            newWidth = lastWidth + Math.floor(sevt.pageX - ev.clientX); //(thisCont.offsetLeft + thisCont.offsetWidth) - sevt.clientX;
                            newHeight = lastHeight - Math.floor(sevt.pageY - ev.clientY);
                            newPosY = lastPosY + (sevt.clientY - ev.clientY);
                            
                            if(newWidth>0 && newHeight>0 && newPosY>0) { ref.width = newWidth; ref.height = newHeight; ref.posY = newPosY; }
                            ref.updateSize();
                            ref.updatePosition();
                        }        
                    }
                }
            },
            resizeBottomLeft:function(ev) {
                if(!ref.locked) {
                    const mainCont = ref.controller.lastRenderedSlide.reference, thisCont = ref.controller.selectedElement.renderedInstance || ev.currentTarget.parentElement;
                    if(ref.width<=0) ref.width = thisCont.clientWidth;
                    if(ref.height<=0) ref.height = thisCont.clientHeight;
                    const lastWidth = ref.width, lastHeight = ref.height, lastPosX = ref.posX;
                    document.onmouseup = function() {
                        document.onmouseup = null;
                        document.onmousemove = null;
                    }
                    document.onmousemove = function(sevt) {
                        let currCordinates = thisCont.getBoundingClientRect(), newWidth = 0, newHeight = 0, newPosX = 0;
                        console.log(sevt.clientX - (currCordinates.left + thisCont.offsetWidth), currCordinates);
                        if(sevt.clientX<(mainCont.offsetLeft + mainCont.offsetWidth) && sevt.clientY<(mainCont.offsetTop + mainCont.offsetHeight)) {
                            newWidth = lastWidth - Math.floor(sevt.clientX - ev.clientX);
                            newHeight = lastHeight + Math.floor(sevt.clientY - ev.clientY);
                            newPosX = lastPosX + (sevt.clientX - ev.clientX);
                            
                            if(newWidth>0 && newHeight>0 && newPosX>0) { ref.width = newWidth; ref.height = newHeight; ref.posX = newPosX; }
                            ref.updateSize();
                            ref.updatePosition();
                        }        
                    }
                }
            },
            resizeBottomRight:function(ev) {
                if(!ref.locked) {
                    const mainCont = ref.controller.lastRenderedSlide.reference, thisCont = ref.controller.selectedElement.renderedInstance || ev.currentTarget.parentElement;
                    if(ref.width<=0) ref.width = thisCont.clientWidth;
                    if(ref.height<=0) ref.height = thisCont.clientHeight;
                    const lastWidth = ref.width, lastHeight = ref.height;
                    document.onmouseup = function() {
                        document.onmouseup = null;
                        document.onmousemove = null;
                    }
                    document.onmousemove = function(sevt) {
                        let currCordinates = thisCont.getBoundingClientRect(), newWidth = 0, newHeight = 0;
                        console.log(sevt.clientX - (currCordinates.left + thisCont.offsetWidth), currCordinates);
                        if(sevt.clientX<(mainCont.offsetLeft + mainCont.offsetWidth)) {
                            newWidth = lastWidth + Math.floor(sevt.pageX - ev.clientX); //(thisCont.offsetLeft + thisCont.offsetWidth) - sevt.clientX;
                            newHeight = lastHeight + Math.floor(sevt.pageY - ev.clientY);
                            
                            if(newWidth>0 && newHeight>0) { ref.width = newWidth; ref.height = newHeight; }
                            ref.updateSize();
                            ref.updatePosition();
                        }        
                    }
                }     
            }
        }
    }

    get isEditable() {return this.controller==null ? false : this.controller.editable;}

    select() {
        if(this.controller.selectElement!=this) {
            console.log("selectedEl is diff");
            if(this.controller.selectElement!=null) {
                console.log("selectedEl is not null");
                const selectedEl = this.controller.selectedElement;
                for(let editModeName of this.editModes) {
                    if(selectedEl.renderedInstance.classList.contains(editModeName)) {
                        this.removeEditEffect(editModeName, selectedEl.renderedInstance);
                        selectedEl.renderedInstance.classList.remove(editModeName);
                    }
                }
            }
            this.controller.selectedElement = this;
            this.renderedInstance.classList.add(this.editModes[0]);
            this.setEditEffect(this.editModes[0], this.renderedInstance);
        } else console.info("Element current selected");
    }

    remove() {
        if(this.parent!=null) {
            console.log(this.controller.selectedElement);
            if(this.controller.selectedElement==this) this.controller.selectedElement = null;
            const slidesEntry = this.parent.getElements();
            for(let elEntry in slidesEntry) {
                if(slidesEntry[elEntry]==this) this.parent.removeElement(elEntry);  
            }
        }
    }

    generatePropertiesList() {
        //const controllerList = ["id", "locked", "layout", "controller", "renderedInstance", "namespace"];
        const controllerList = Object.assign(this.inheritedAttributes, {});
        let propObj = {};
        for(let prop in this) {
            if(controllerList.includes(prop)) propObj[prop] = this[prop];
        }
        return propObj;
    }

    renderAsInteractiveProperties(initialObj=null, deleteButtonRender=true, onDeletion=undefined) {
        let interProps = [];
        const ref = this;
        const propObj = initialObj!=null ? initialObj : this.generatePropertiesList();
        for(let parsedProp in propObj) {
            switch(typeof propObj[parsedProp]) {
                case "string":
                    interProps.push((<span><strong>{parsedProp}</strong><br/><input type="text" defaultValue={propObj[parsedProp]} onChange={ev=>{
                        ref[interProps] = ev;
                    }} onInput={ev=>{
                        ref[interProps] = ev.currentTarget.value;
                    }}/><br/></span>));
                break;
                case "number":
                    interProps.push((<span><strong>{parsedProp}</strong><input type="number" defaultValue={""+propObj[parsedProp]} onChange={ev=>{
                        ref[parsedProp] = parseFloat(ev.currentTarget.value);
                        console.log("changed", parsedProp);
                        switch(parsedProp) {
                            case "posX":
                            case "posY":
                                console.log("position");
                                ref.updatePosition();
                            break;
                            case "angle":
                                console.log("angle");
                                ref.updateRotation();
                            break;
                        }
                    }}/><br/></span>));
                break;
                case "boolean":
                    interProps.push((<span><strong>{parsedProp}</strong><input type="checkbox" defaultValue={!!propObj[parsedProp]} onChange={ev=>{
                        ref[parsedProp] = !!ev.currentTarget.checked;
                    }}/><br/></span>));
                break;
                case "object":
                    return this.renderAsInteractiveProperties(propObj[parsedProp], false);
                break;
            }
        }
        if(deleteButtonRender) interProps.push((<input type="button" value="Usuń" onClick={e=>{
            if(typeof onDeletion=="function") onDeletion(e);
        }}/>));
        return interProps;
    }
    
    onEditStart(e, ref) {
        e = e || window.event;
        let evt = e.currentTarget, selectedEl = this.renderedInstance;
                /*if(selectedEl.classList.contains("moveable")) selectedEl.classList.remove("moveable");
                if(selectedEl.classList.contains("rotateable")) selectedEl.classList.remove("rotateable");*/
        if(ref.controller.selectedElement==null || evt!=ref.controller.selectedElement.renderedInstance || evt.classList.length<=1) {
            if(ref.controller.selectedElement!=null && typeof ref.controller.selectElement!="undefined") {
                evt.classList.add(this.editModes[0]);
                ref.setEditEffect(this.editModes[0], evt);
                ref.controller.selectedElement = ref;
            } else {
                for(let editModeName of this.editModes) {
                    if(selectedEl.classList.contains(editModeName)) {
                        ref.removeEditEffect(editModeName, selectedElement);
                        selectedElement.classList.remove(editModeName);
                    }
                }
                ref.controller.selectedElement = ref;
                evt.classList.add(this.editModes[0]);
                ref.setEditEffect(this.editModes[0], evt);
            }
        }           
    }

    onEditChange(e, ref) {
        e = e || window.event;
        let evt = e.currentTarget, iter = 0;
        for(let modeName of this.editModes) {
            if(evt.classList.contains(modeName)) {
                ref.removeEditEffect(modeName, evt);
                evt.classList.remove(modeName);
                const targetMode = this.editModes.length-1>iter ? this.editModes[iter + 1] : this.editModes[0];
                evt.classList.add(targetMode);
                ref.setEditEffect(targetMode, evt);
                break;
            } else {
                if(iter==this.editModes.length-1) evt.classList.add(this.editModes[0]);
            }
            iter++;
        }
    }

    removeEditEffect(editModeName, evt) {
        switch(editModeName) {
            case "valueEditable":
                evt.children[0].setAttribute("disabled");
                evt.children[0].onchange = null;
            break;
            case "contentEditable":
                evt.children[0].removeAttribute("contenteditable");
                evt.children[0].onchange = null;
            break;
            case "moveable":
                evt.removeEventListener("mousedown", this.editEvents.move);
            break;
            case "resizeable":
                for(let num in evt.children) {
                    if(!isNaN(num) && evt.children[num].classList.contains("corner")) {
                        evt.children[num].remove();
                    }
                }
            break;
            case "rotateable":
                evt.removeEventListener("mousedown", this.editEvents.rotate);
            break;
        }
    }

    setEditEffect(editModeName, evt) {
        switch(editModeName) {
            case "valueEditable":
                evt.children[0].renoveAttribute("disabled");
                evt.children[0].onchange = function(ev) {
                    ref.value = ev.children[0].textContent;
                }
            break;
            case "contentEditable":
                evt.children[0].contentEditable = true;
                evt.children[0].onchange = function(ev) {
                    ref.value = ev.children[0].textContent;
                }
            break;
            case "moveable":
                evt.addEventListener("mousedown", this.editEvents.move);
            break;
            case "resizeable":
                let resCorner1 = document.createElement("span"), resCorner2 = document.createElement("span"), resCorner3 = document.createElement("span"), resCorner4 = document.createElement("span");
                resCorner1.className = "corner cornerLeftyTop";
                resCorner1.addEventListener("mousedown", this.editEvents.resizeTopLeft);
                resCorner2.className = "corner cornerLeftyBottom";
                resCorner2.addEventListener("mousedown", this.editEvents.resizeBottomLeft);
                resCorner3.className = "corner cornerRightyTop";
                resCorner3.addEventListener("mousedown", this.editEvents.resizeTopRight);
                resCorner4.className = "corner cornerRightyBottom";
                resCorner4.addEventListener("mousedown", this.editEvents.resizeBottomRight);
                evt.appendChild(resCorner1);
                evt.appendChild(resCorner2);
                evt.appendChild(resCorner3);
                evt.appendChild(resCorner4);
            break;
            case "rotateable":
                evt.addEventListener("mousedown", this.editEvents.rotate);
            break;
        }
    }

    get errorTemplate() {

    }

    get template() {
        return {
            "readable":{
                "component":(<output>Empty Element</output>),
                "nativeElement":(function() {
                    mainEl = document.createElement("output");
                    mainEl.textContent = "Empty Element";
                    return mainEl;
                }()),
                "HTMLCode":`<output>Empty Element</output>`
            }
        };
    }

    prepareMissingPropertials() {
        let finalTemplate = this.template;
        if(typeof finalTemplate.readable.component=="undefined") finalTemplate.readable.component = (<var>Empty Element</var>);
        if(typeof finalTemplate.readable.nativeElement=="undefined") finalTemplate.readable.nativeElement = function() { let defVar = docuemnt.createElement("var"); defVar.textContent = "Empty Element"; return defVar; };
        if(typeof finalTemplate.readable.HTMLCode=="undefined") finalTemplate.readable.HTMLCode = finalTemplate.readable.nativeElement.outerHTML || `<var>Empty Element</var>`;
        finalTemplate.editable = Object.assign(finalTemplate.readable, finalTemplate.editable);
        return finalTemplate;
    }

    updatePosition(newPosX = -1, newPosY = -1) {
        if(this.renderedInstance!=null) {
        if(newPosX>0) this.posX = parseInt(newPosX);
        if(newPosY>0) this.posY = parseInt(newPosY);
        this.renderedInstance.style.top = this.posY + 'px';
        this.renderedInstance.style.left = this.posX + 'px';
        } else console.warn("You must render element first before updating interactive params");
    }

    updateRotation(newAngle = -1) {
        if(this.renderedInstance!=null) {
        if(newAngle>0) this.renderedInstance.style.transform = `rotate(${this.angle}deg)`;
        }
    }

    asComponent() {
        let ref = this, finalTemplate = this.prepareMissingPropertials();
        console.log(this.controller);
        console.log(this.isEditable);
        return this.isEditable ? createReactClass({
            render() {
                const ContextEl = finalTemplate.editable.component;
                return (
                <div className={ref.renderedEditableClasses} style={{left: ref.posX+"px", top: ref.posY+"px"}} ref={r=>ref.renderedInstance = r} onClick={e=>ref.onEditStart(e, ref)} onDoubleClick={e=>ref.onEditChange(e, ref)}>{ContextEl}</div>
                )
            }
        }) : createReactClass({
            render() {
                const ContextEl = React.cloneElement(finalTemplate.readable.component, {style:{left: ref.posX+"px", top: ref.posY+"px"}, ref:r=>ref.renderedInstance = r, suppressContentEditableWarning:true});
                return (
                    ContextEl
                )
            }
        });
    }

    asNativeElement() {
        let finalTemplate = this.prepareMissingPropertials();
        if(this.isEditable) { const mainEl = finalTemplate.editable.nativeElement; let editContainer = docuemnt.createElement("div"); editContainer.className = this.renderedEditableClasses; this.renderedInstance = editContainer; editContainer.appendChild(mainEl); return editContainer; } else { const mainEl = finalTemplate.readable.nativeElement; this.renderedInstance = mainEl; return mainEl; }
    }

    asHTMLCode() {
        let finalTemplate = this.prepareMissingPropertials();
        return this.isEditable ? `<div class="${this.renderedEditableClasses}">${finalTemplate.editable.HTMLCode}</div>` : finalTemplate.readable.HTMLCode;
    }
}

export class PresentationPartialElement {
    parent = null;

    constructor(parentEl) {
        this.parent = parentEl;
    }


}

export class PresentationBlockElement extends PresentationElement {
    childElements = new Array();
    width = 0;
    height = 0;
    opaque = .0;

    editModes = ["moveable", "resizeable", "rotateable"];

    constructor() {
        super();
    }

    updateSize(newWidth = -1, newHeight = -1) {
        if(newWidth>0) this.width = newWidth;
        if(newHeight>0) this.height = newHeight;
        this.renderedInstance.style.width = this.width + "px";
        this.renderedInstance.style.height = this.height + "px";
    }
    
    addElement() {

    }

    get template() {
        this.renderedEditableClasses = "presetationBlockElement";
        const childElementsPrepared = this.childElements.map((childEl)=>{
            const RendEl = childEl.asComponent();
            return (<RendEl />);
        });
        return {
            component:(<>{childElementsPrepared}</>),
            nativeElement:(function() {

            }()),
            HTMLCode:``
        }
    }
}


export class PresentationHeader {

}

export class PresentationFooter {
    
}

//Texts and links
export class PresentationText extends PresentationElement {
    lang = "pl-PL";
    value = "";

    editModes = ["contentEditable", "moveable", "rotateable"];

    constructor(newVal="Sample text", initialController=null) {
        super(initialController);
        this.value = newVal;
    }

    get template() {
        return {
            "readable":{
                component:(<p>{this.value}</p>)
            },
            "editable":{
                component:(<p>{this.value}</p>)
            }
        }
    }
}

export class PresentationCaption extends PresentationText {
    constructor(newVal, initialController=null) {
        this.value = newVal;
        this.controller = initialController;
    }

    asComponent() {
        return this.isEditable ? createReactClass({
            render() {
                return (
                    <h2 className="editable" contentEditable>{this.value}</h2>
                )
            }
        }) : createReactClass({
            render() {
                return (
                    <h2>{this.value}</h2>
                )
            }
        });
    }

    asNativeElement() {
        let currEl = document.createElement("h2");
        currEl.textContent = this.value;
        if(this.isEditable) { currEl.classList.add("editable"); currEl.contentEditable = true; }
        return currEl;
    }

    asHTMLCode() {
        return this.isEditable ? `<h2 class="editable" contentEditable>${this.value}</h2>` : `<h2>${this.value}</h2>`;
    }
}

export class PresentationTitle extends PresentationText {
    constructor(newVal, initialController=null) {
        this.value = newVal;
        this.controller = initialController;
    }

    asComponent() {
        return this.isEditable ? createReactClass({
            render() {
                return (
                    <h1 className="editable" contentEditable>{this.value}</h1>
                )
            }
        }) : createReactClass({
            render() {
                return (
                    <h1>{this.value}</h1>
                )
            }
        });
    }

    asNativeElement() {
        let currEl = document.createElement("h1");
        currEl.textContent = this.value;
        if(this.isEditable) { currEl.classList.add("editable"); currEl.contentEditable = true; }
        return currEl;
    }

    asHTMLCode() {
        return this.isEditable ? `<h1 class="editable" contentEditable>${this.value}</h1>` : `<h1>${this.value}</h1>`;
    }
}

export class PresentationTextField extends PresentationBlockElement {

}

export class PresentationWordArt {

}

export class PresentationLink {

}

//Images
export class PresentationImage extends PresentationBlockElement {
    controller = null;

    src = defaultSrcOfPic;
    width = 300;
    

    constructor(newSrc=defaultSrcOfPic) {
        super();
        this.src = newSrc;
        console.log(this.renderedInstance);
    }

    get template() {
        const ref = this;
        return {
            readable:{
                component:(<img width={this.width>0 ? this.width : null} height={this.height>0 ? this.height : null} src={this.src} onError={()=>{}} alt="Nie załadowano obrazu"/>),
                nativeElement:(function() {
                    let currEl = document.createElement("div");
                    currEl.className = "presentationImageDecorator";
                        let imgPic = document.createElement("img");
                        imgPic.src = ref.src;
                        imgPic.alt = "Nie załadowano obrazu";
                        currEl.appendChild(imgPic);
                    return currEl;
                }())
            },
            editable:{
                component:(<div className="presentationImageDecorator"><img  width={this.width>0 ? this.width : null} height={this.height>0 ? this.height : null} src={this.src} onError={()=>{}}  alt="Nie załadowano obrazu"/></div>)
            }
        }
    }

    updateSize(newWidth = -1, newHeight = -1) {
        if(newWidth>0) this.width = newWidth;
        if(newHeight>0) this.height = newHeight;
        this.renderedInstance.children[0].children[0].style.width = this.width + "px";
        this.renderedInstance.children[0].children[0].style.height = this.height + "px";
    }
}

export class PresentationImageHolder extends PresentationElement {
    src = "";
    caption = "";

    constructor(newSrc="", caption="") {
        this.src = newSrc;
        this.caption = caption;
    }

    asComponent() {
        return createReactClass({
            render() {
                return (
                    <figure class="presentationElement presentationImageHolder"><img src={this.src} onError={()=>{}} alt="Nie załadowano obrazu"/><figcaption>{this.caption}</figcaption></figure>
                )
            }
        });
    }

    asNativeElement() {
        let currEl = docuemnt.createElement("figure");
        currEl.className = "presentationElement presentationImageHolder";
            let imgPic = document.createElement("img");
            imgPic.src = this.src;
            imgPic.alt = "Nie załadowano obrazu";
            currEl.appendChild(imgPic);
            let capt = document.createElement("figcaption");
            capt.textContent = this.caption;
            currEl.appendChild(capt);
        return currEl;
    }

    asHTMLCode() {
        return `<figure class="presentationElement presentationImageHolder"><img src="${this.src}"><figcaption>${this.caption}</figcaption></figure>`;
    }
}

//Movies support
export class PresentationVideo {

}

//Symbolms and Math
export class PresentationMathFormula {

}
export class PresentationSymbol {
    
}

//Sounds
export class PresentationSound {

}

/* Tables */
export class PresentationTableColumnHeading extends PresentationPartialElement {
    value = "";

    constructor() {

    }
}

export class PresentationTableColumn extends PresentationPartialElement {
    value = "";

    constructor() {

    }

    asComponent() {
        return this.parent.isEditable ? createReactClass({
            render() {
                return (
                    <td className="editable" contentEditable></td>
                )
            }
        }) : createReactClass({
            render() {
                return (<td></td>)
            }
        });
    }
}

export class PresentationTable extends PresentationElement {
    rows = new Array();
    columns = new Array();

    constructor() {

    }

    addRow() {

    }



    asComponent() {
        if(this.isEditable) {
            let genRows = [], maxRows = 0;
            for(let genRow in this.rows) {
                let genColEntries = [];
                for(let genCol in this.columns[genRow]) {
                    maxRows = Math.max(maxRows, this.columns[genRow].length);
                    genColEntries.push(this.columns[genRow][genCol].asComponent());
                }
                const newRowEl = (<tr>{genColEntries}<td>&#x0002B;</td></tr>);
                genRows.push(newRowEl);
            } 
            return createReactClass({
                render() {
                    return (
                        <table>
                            {genRows}
                            <tr><td colSpan={maxRows}>&#x0002B;</td></tr>
                        </table>
                    )
                }
            })
        } else {
            let genRows = [];
            for(let genRow in this.rows) {
                let genColEntries = [];
                for(let genCol in this.columns[genRow]) {
                    genColEntries.push(this.columns[genRow][genCol].asComponent());
                }
                const newRowEl = (<tr>{genColEntries}</tr>);
                genRows.push(newRowEl);
            } 
            return createReactClass({
                render() {
                    <table>
                        {genRows}
                    </table>
                }
            });
        }
    }

    asNativeElement() {

    }

    asHTMLCode() {

    }
}