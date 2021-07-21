import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './RollerViewer.css';
import '../rollerWinderParser.css';
import { PresentationElement, PresentationSlideParentLayout, PresentationDocument, PresentationSlide, GenerateSamplePresentation } from '../rollerWinderParser';

class RollerViewer extends React.Component {
    constructor(props) {
        super(props);
        //autoplay
        this.state = {
            isLoader: false,
            presentationSlides:[],
            currSlide: 1,
            duringPlay:false
        }
        this.onCompress = this.onCompress.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.currDocument = this.props.currDocument || GenerateSamplePresentation();
        this.autoplay = this.props.autoplay;
        this.timeSet = this.props.timeSet * 100 || 1000;
    }

    onCompress(event){
        console.log("Pressed");
        if(event.keyCode === 27) {
            let currEl = ReactDOM.findDOMNode(this), tgBtn = currEl.children[2];
            tgBtn = tarBtn.children[tarBtn.children.length - 1];
            console.log(currEl);
            if(currEl.classList.contains("fullscreenMode")) { 
                currEl.classList.remove("fullscreenMode"); 
                tgBtn.children[0].className = "fas fa-expand";
            }
        }
    }

    componentDidMount(){
        document.addEventListener("keydown", this.onCompress, false);
        let currEl = ReactDOM.findDOMNode(this), currView = currEl.children[1];
        this.currDocument.setResByCalculatedWidth(currEl.clientWidth);
        this.setState({presentationSlides:this.currDocument.getSlides()});
        //this.state.presentationSlides.concat([exampleSlide])*/

    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.onCompress, false);
    }

    requestFullScreen(evt) {
        var el = document.body;
        var tgBtn = evt.currentTarget;
        var cont = tgBtn.parentElement.parentElement;
        if(typeof window.ActiveXObject !== "undefined") {
            var wscript = new ActiveXObject("WScript.Shell");
              if (wscript !== null) {
                wscript.SendKeys("{F11}");
              }
        } else if ((document.fullScreenElement && document.fullScreenElement !== null) ||    
        (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen 
            || el.mozRequestFullScreen || el.msRequestFullScreen;
            console.log(requestMethod);
            if (requestMethod) {
                tgBtn.children[0].className = "fas fa-compress";
                cont.classList.add("fullscreenMode");
                requestMethod.call(el);
            }
        } else {
            var requestMethod = document.cancelFullScreen || document.mozCancelFullScreen || document.webkitCancelFullScreen;
            console.log(requestMethod);
            if(requestMethod) {
                tgBtn.children[0].className = "fas fa-expand";
                cont.classList.remove("fullscreenMode");
                requestMethod.call(document);
            }
        }
    }

    onPlayStart(evt) {
        setInterval(this.onPlay, this.timeSet);
    }

    onPlay() {
        if(this.currDocument.length<=this.currSlide) this.changeSlide(1); else this.changeSlide(1, "mod");
    }

    onPause(evt) {
        clearInterval(this.onPlay);
    }

    changeSlide(newInd, op="new") {
        if(op=="mod") newInd = this.state.currSlide + newInd;
        if(newInd>0 && newInd<this.currDocument.length) this.setState({currSlide: newInd});
    }

    handleChange(evt) {
        this.setState({currSlide: evt.target.value});
    }

    addPresentationElement() {

    }

    render() {
        const { presentationSlides, currSlide } = this.state;
        const presentationSlidesParsed = presentationSlides.map(PresentationSl=>{let Comp = PresentationSl.asComponent(); return (<Comp />)})
        console.log(presentationSlidesParsed[currSlide - 1]);
        return (
            <div className="rollerViewer-container">
                <div className="rollerViewer-overlay-caption"></div>
                <div className="rollerViewer-presentation-view">{presentationSlidesParsed[currSlide - 1]}</div>
                <div className="rollerViewer-actionsBar">
                    <span className="rollerViewer-playAction"><i className="fas fa-play"></i></span>
                    <span className="rollerViewer-previousSlideAction" onClick={()=>this.changeSlide(-1, "mod")}><i className="fas fa-chevron-left"></i></span>
                    <span className="rollerViewer-presentationIndex"><input type="number" min="1" max={this.currDocument.length} value={currSlide} onChange={this.handleChange} /></span>
                    <span className="rollerViewer-nextSlideAction" onClick={()=>this.changeSlide(1, "mod")}><i className="fas fa-chevron-right"></i></span>
                    <span className="rollerViewer-restartPresentationAction" onClick={()=>this.changeSlide(1)}><i className="fas fa-undo"></i></span>
                    <span className="rollerViewer-fullScreen righty" onClick={e=>this.requestFullScreen(e)}><i className="fas fa-expand"></i></span>
                </div>
            </div>
        )
    }
}

export default RollerViewer;