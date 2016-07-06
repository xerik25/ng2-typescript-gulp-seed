import {Component, ApplicationRef} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, Router} from 'angular2/router';
import {Storage} from './services/object-storage/object-storage.service';
import {HomeComponent} from "./components/pages/home/home.component";
import {ExampleComponent} from "./components/example-component/example.component"; // DELETE for Prod

@Component({
    selector: 'my-app',
    template: require('./app.html'),
    directives: [ROUTER_DIRECTIVES],
    providers: [
        ROUTER_PROVIDERS,
        Storage,
    ]
})

@RouteConfig([
    {
        path: '/',
        name: 'Home',
        component: HomeComponent,
        useAsDefault: true,
    },
    { path: '/demo', name: 'Demo', component: ExampleComponent }, // DELETE for prod
    { path: "/**", redirectTo: ["Home"] }
])

export class AppComponent {


    constructor(router: Router, _storage: Storage, private _applicationRef:ApplicationRef) {


        router.subscribe(() => {

            // This is needed for the back button to work correctly on iOS and Safari.
            this._applicationRef.tick();
            setTimeout(() => {
                this._applicationRef.tick();
            }, 100);
        });
    }
}
