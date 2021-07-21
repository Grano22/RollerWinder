import React, {Component} from 'react';
import { pageUrl } from '../global'
import axios from 'axios';

class SlidesPage extends Component {
    constructor() {
        super();
        this.state = { slides:[], loaded: false };
    }

    getSlidesEntries() {
        axios.get(pageUrl+"api/slides").then(res=>{
            this.setState({ slides:res.data, loaded:true });
        });
    }

    componentDidMount() {
        this.getSlidesEntries();
    }

    render() {
        const loading = this.state.loading;
        return  (
            <div>
                <header>
                    
                </header>
                <section className="">

                </section>
            </div>
        )
    }
}