import {Component, OnInit} from 'angular2/core';
import {BtnComponent} from "../../partials/btn/btn.component";

@Component({
    selector: 'home',
    template: require('./home.html'),
    directives: [BtnComponent]
})

export class HomeComponent implements OnInit {

    ngOnInit() {
    }
}

