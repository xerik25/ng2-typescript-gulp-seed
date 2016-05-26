import {Component, OnInit} from 'angular2/core';

@Component({
    selector: 'example',
    template: require('./example.html'),
    styles:  [require('./example.scss').css.toString()],
    directives: []
})

export class ExampleComponent implements OnInit {

    ngOnInit() {
    }
}

