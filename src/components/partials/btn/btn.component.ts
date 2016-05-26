import {Component, OnInit} from 'angular2/core';
import {Input} from "angular2/core";

@Component({
    selector: 'btn',
    template: require('./btn.html'),
    directives: []
})

export class BtnComponent implements OnInit {

    @Input() btnText: string;

    ngOnInit() {
    }
}

