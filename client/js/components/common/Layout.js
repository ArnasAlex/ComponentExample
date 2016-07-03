import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';

export default class Layout extends React.Component {
    render() {
        return (
            <div className="container">
                <Header></Header>
                {this.props.children}
            </div>
        );
    }
}