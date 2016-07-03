import React from 'react';
import ReactDOM from 'react-dom';
import Slider from './Slider';

export default class SliderPage extends React.Component {
    constructor() {
        super();

        this.onClickValueButton = this.onClickValueButton.bind(this);
        this.onClickUpdateOptionsButton = this.onClickUpdateOptionsButton.bind(this);
    }

    componentDidMount() {
        let options = {
            parentElement: this.sliderContainer,
            minValue: 5,
            maxValue: 25,
            step: 5
        };
        this.slider = new Slider(options);

        this.slider.on('change', (val) => {
            let percents = Math.round(this.slider.getPercentage() * 100);
            this.percents.innerHTML = `${percents} %`;
            this.valueInput.value = Math.round(val);
        });

        this.slider.on('change', (val) => {
            let percents = this.slider.getPercentage();
            this.setColorToContainer(percents);
        });

        this.percents.innerHTML = `${this.slider.getPercentage()} %`;
        this.valueInput.value = this.slider.getValue();
        this.stepInput.value = this.slider.options.step;
        this.minInput.value = this.slider.options.minValue;
        this.maxInput.value = this.slider.options.maxValue;
        this.setColorToContainer(0);
    }

    componentWillUnmount() {
        this.slider.destroy();
    }

    render(){
        return (
            <div className="row">
                <div className="col-xs-12">
                    <div ref={(ref) => this.sliderContainer = ref}></div>
                </div>
                <hr />
                <div className="col-xs-4">
                    <div ref={(ref) => this.percents = ref}></div>
                </div>
                <div className="col-xs-4">
                    <div className="row">
                        <span className="col-xs-4">Value: </span>
                        <input className="col-xs-4" type="text" ref={(ref) => this.valueInput = ref}></input>
                        <button className="col-xs-4" type="button" ref={(ref) => this.valueButton = ref} onClick={this.onClickValueButton}>Set</button>
                    </div>
                    <br />
                    <div className="row">
                        <span className="col-xs-4">Step: </span>
                        <input className="col-xs-4" type="text" ref={(ref) => this.stepInput = ref}></input>
                    </div>
                    <div className="row">
                        <span className="col-xs-4">Min: </span>
                        <input className="col-xs-4" type="text" ref={(ref) => this.minInput = ref}></input>
                    </div>
                    <div className="row">
                        <span className="col-xs-4">Max: </span>
                        <input className="col-xs-4" type="text" ref={(ref) => this.maxInput = ref}></input>
                    </div>
                    <div className="row">
                        <button className="col-xs-12" type="button" ref={(ref) => this.updateOptionsButton = ref} onClick={this.onClickUpdateOptionsButton}>Update Options</button>
                    </div>
                </div>
                <div className="col-xs-4">
                    <div className="color-container" ref={(ref) => this.colorContainer = ref}></div>
                </div>
            </div>
        );
    }

    onClickValueButton(){
        this.slider.setValue(this.valueInput.value);
    }

    setColorToContainer(alpha){
        this.colorContainer.style.backgroundColor = `rgba(0, 255, 0, ${alpha})`;
    }

    onClickUpdateOptionsButton(){
        this.slider.changeOptions({
            minValue: this.minInput.value,
            maxValue: this.maxInput.value,
            step: this.stepInput.value
        });
    }
}