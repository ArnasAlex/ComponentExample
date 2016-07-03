export default class Slider {
    constructor(options){
        this.options = options;

        if (!this.options || !this.options.parentElement){
            this.showInitError();
            throw Error('Invalid constructor parameters');
        }

        if (this.options.minValue === undefined){
            this.options.minValue = 0;
        }

        if (this.options.maxValue === undefined){
            this.options.maxValue = 100;
        }

        if (this.options.step === undefined){
            this.options.step = 1;
        }

        this.init();
    }

    destroy(){
        this.unbindEvents();
    }

    showInitError(){
        let optionsDescription = {
            parentElement: 'DOM element in which slider will be inserted',
            minValue: 'Default = 0',
            maxValue: 'Default = 100',
            step: 'Default = 1'
        };
        let msg = 'Slider options must contain parentElement property. Example: \n' +
            JSON.stringify(optionsDescription, null, 2);

        this.showError(msg);
    }

    init(){
        this.percents = 0;
        this.events = {
            change: []
        };

        this.createElement();
        this.initConstants();
        this.bindEvents();
    }

    createElement(){
        this.element = this.getTemplate();
        this.options.parentElement.appendChild(this.element);
    }

    initConstants(){
        this.barMargin = 5;
        this.minKnobPosition = this.bar.getBoundingClientRect().left;
        this.maxKnobPosition = this.bar.getBoundingClientRect().right;
        this.barLenght = this.maxKnobPosition - this.minKnobPosition - this.barMargin;
    }

    bindEvents(){
        let events = ['onMouseDown'];
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);

        this.element.addEventListener('mousedown', this.onMouseDown);
        this.element.addEventListener('touchstart', this.onMouseDown);
        this.element.addEventListener('dragstart', this.onDragStart);
        window.addEventListener('resize', this.onWindowResize);
    }

    unbindEvents(){
        this.element.removeEventListener('mousedown', this.onMouseDown);
        this.element.removeEventListener('touchstart', this.onMouseDown);
        this.element.removeEventListener('dragstart', this.onDragStart);
        window.removeEventListener('resize', this.onWindowResize);
    }

    onMouseDown(evt){
        this.updateSlider(evt);

        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('touchend', this.onMouseUp);
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('touchmove', this.onMouseMove);
    }

    onMouseUp(evt){
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('touchend', this.onMouseUp);
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('touchmove', this.onMouseMove);
    }

    onMouseMove(evt){
        this.updateSlider(evt);
    }

    updateSlider(evt){
        let mouseCoords = this.getMouseCoords(evt);
        let x = mouseCoords.x - this.minKnobPosition;

        let percents = (x - this.barMargin) / (this.barLenght - 2 * this.barMargin);
        this.setPercents(percents);
    }

    setPercents(percents){
        percents = this.respectPercentBoundaries(percents);
        percents = this.respectPercentStep(percents);

        this.percents = percents;
        this.updateKnobPosition();
    }

    respectPercentBoundaries(percents){
        if (percents > 1){
            percents = 1;
        }
        if (percents < 0){
            percents = 0;
        }

        return percents;
    }

    respectPercentStep(percents){
        if (this.options.step === 1){
            return percents;
        }

        let step = this.options.step;
        let value = this.convertPercentsToValue(percents) - this.options.minValue;
        value = Math.round(value / this.options.step) * step;

        if (value + this.options.minValue > this.options.maxValue){
            value = value - step;
        }

        percents = this.convertValueToPercents(value);

        return percents;
    }

    updateKnobPosition(){
        let leftPos = this.percents * (this.barLenght - 2 * this.barMargin) + this.barMargin;
        this.changeKnobLeftStyle(leftPos);

        let value = this.getValue();
        this.trigger('change', value);
    }

    onDragStart(evt){
        evt.preventDefault();
        return false;
    }

    getMouseCoords(evt) {
        return {x: evt.pageX, y: evt.pageY};
    }

    onWindowResize(evt) {
        this.initConstants();
    }

    changeKnobLeftStyle(leftPosition){
        this.knob.style.left = leftPosition + 'px';
    }

    on(eventName, callback){
        if (!this.events[eventName]){
            let availableEvents = Object.keys(this.events).join(', ');
            let msg = `Event not supported: ${eventName}. Available events: ${availableEvents}`;
            this.showError(msg);
            return;
        }

        this.events[eventName].push(callback);
    }

    trigger(eventName, value){
        let callbacks = this.events[eventName];
        for (let i = 0; i < callbacks.length; i++){
            callbacks[i](value);
        }
    }

    getPercentage(){
        return this.percents;
    }

    getValue(){
        return this.convertPercentsToValue(this.percents);
    }

    setValue(val){
        val = val - this.options.minValue;
        let percents = this.convertValueToPercents(val);
        this.setPercents(percents);
    }

    convertPercentsToValue(percents){
        return this.options.minValue + (this.options.maxValue - this.options.minValue) * percents;
    }

    convertValueToPercents(value){
        return value / (this.options.maxValue - this.options.minValue);
    }

    changeOptions(options){
        if (options.minValue !== undefined){
            this.options.minValue = parseInt(options.minValue);
        }

        if (options.maxValue !== undefined){
            this.options.maxValue = parseInt(options.maxValue);
        }

        if (options.step !== undefined){
            this.options.step = parseInt(options.step);
        }

        this.initConstants();
        this.setValue(this.options.minValue);
    }

    getTemplate(){
        let template = document.createElement('div');
        template.className = 'slider-container center-block';

        this.bar = document.createElement('div');
        this.bar.className = 'slider-bar';

        this.knob = document.createElement('div');
        this.knob.className = 'slider-knob';

        template.appendChild(this.bar);
        template.appendChild(this.knob);

        return template;
    }

    showError(error){
        console.log('Error from Slider component: ' + error);
    }
}