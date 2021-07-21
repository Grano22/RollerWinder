import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { LogsGlobalHandler } from './libs/LogsHandler';
//import { Router, Route, browserHistory } from 'react-router';
//require('@fortawesome/fontawesome-free/css/all.min.css');
//require('@fortawesome/fontawesome-free/js/all.js');
import '../css/app.css';
import Home from './components/Home';

window.globalLogsHandler = new LogsGlobalHandler();
ReactDOM.render(<Router><Home /></Router>, document.getElementById('root'));
// history={browserHistory}
console.info("Content generated sucessfully");