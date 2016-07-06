import {Component, OnInit} from 'angular2/core';
import {Storage} from '../../services/object-storage/object-storage.service';

@Component({
    selector: 'example',
    template: require('./example.html'),
    directives: []
})

export class ExampleComponent implements OnInit {

    /**
     * The Storage class injectable.
     */
    _storage: any;

    constructor(_storage: Storage) {

        this._storage = _storage;
        this._storage.setObject('localStorage', {testKey: 1});

        // Observable on local storage object
        _storage.objectChange$.subscribe(($event) => {
            console.log('observable event', $event)
        });

    }

    getObject () {
        console.log('getObject',this._storage.getObject('localStorage'));
    }

    setObject () {
        this._storage.setObject('localStorage', {testKey: 1});
        console.log('setObject',this._storage.getObject('localStorage'));
    }

    updateObject () {
        var currentVal = this._storage.getObject('localStorage').testKey;
        this._storage.updateObject('localStorage', {testKey: currentVal + 1});

        console.log('newObject',this._storage.getObject('localStorage'));
    }

    deleteObject () {
        this._storage.deleteObject('localStorage');
        console.log('deleted');
    }

    ngOnInit() {
    }
}

