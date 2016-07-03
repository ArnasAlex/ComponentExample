import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';

export default class Header extends React.Component {
    render(){
        return (
            <div>
                <h1 className="text-center header">Component example</h1>
                <div className="row">
                    <div className="">
                        <Link to="/slider" className="btn btn-info col-xs-4 col-xs-offset-1">Slider</Link>
                        <Link to="/box" className="btn btn-info col-xs-4 col-xs-offset-2">Box</Link>
                    </div>
                </div>
                <br />
            </div>
        );
    }
}