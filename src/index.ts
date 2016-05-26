import 'core-js';
import {enableProdMode} from 'angular2/core';
import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './app.component';

require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');

enableProdMode();

bootstrap(AppComponent);
