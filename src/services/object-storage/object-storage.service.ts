import {Injectable, EventEmitter, Output} from 'angular2/core';

/**
 *
 * The Storage class exposes a few methods for storing, retrieving and updating objects through localStorage.
 *
 * @use `Storage.getObject(key);`
 * @use `Storage.setObject(key, obj);`
 */
    
@Injectable()
export class Storage {

    /**
     * 
     * @type {EventEmitter} Used to emit changes to LocalStorage.
     */
    @Output() objectChange$ = new EventEmitter();

    /**
     *
     * @param key A string to search for in localStorage.
     * @returns A value string if the key was found, null if nothing was found.
     * @private
     */
    private _getItem(key: string) {
        
        return localStorage.getItem(key);
    };

    /**
     *
     * @param key   A string to set as the key of the localStorage object.
     * @param value A string to set as the value of the localStorage object.
     * @returns {any}
     * @private
     */
    private _setItem(key: string, value: string) {
        
        return localStorage.setItem(key, value);
    };

    /**
     *
     * @param key   A string to search for in the localStorage.
     * @returns The matching object, if it exists and is valid. Otherwise it returns undefined;
     */
    getObject(key: string) {
        
        var response: any;

        /**
         *
         * Catch exceptions and return a response that means something instead of blowing up.
         */
        try {
            
            response = JSON.parse(this._getItem(key));
        } catch( e ) { }
        
        return response !== null ? response : false;
    };

    /**
     *
     * @param key   A string to set as the key.
     * @param value An object to convert to a JSON string and save as the value.
     * @returns {any}
     */
    setObject(key:string, value: any) {
        
        return this._setItem(key, JSON.stringify(value));
    };

    /**
     * 
     * @param oldObject An old object to merge with
     * @param newObject A new object to merge
     * @returns object
     * @private
     * 
     * This method allows us to merge objects recursively rather than just going 1 level deep and is an abstraction
     * from the actual object update method.
     */
    private _updateObjectInline(oldObject: any, newObject: any) {
        
        var updatedObject: any = {};
        
        for( var x in oldObject ) {

            if( oldObject.hasOwnProperty(x) ) {

                updatedObject[x] = oldObject[x];
            }
        }

        for( var x in newObject ) {

            if( newObject.hasOwnProperty(x) ) {
                
                if( 
                    newObject[x] !== null && 
                    typeof newObject[x] === 'object' &&
                    updatedObject[x] !== null &&
                    typeof updatedObject[x] === 'object'
                ) {

                    updatedObject[x] = this._updateObjectInline(updatedObject[x], newObject[x]);
                } else {

                    updatedObject[x] = newObject[x];
                }
            }
        }
        
        return updatedObject;
    }

    /**
     *
     * @param key   A string to search for in localStorage.
     * @param value An object to merge into the found object.
     * @returns A merged and stored object, if it exists. Otherwise it returns the original found object.
     */
    updateObject(key: string, value: any) {
        
        if(value.reset === true) {
            
            updatedObject = "";
        } else {

            var oldObject = this.getObject(key);
            var updatedObject: any = {};

            if( oldObject === false ) {

                updatedObject = value;
            } else if(
                value !== null &&
                typeof value === 'object'
            ) {

                updatedObject = this._updateObjectInline(oldObject, value);
            } else {

                updatedObject = oldObject;
            }

        }
        
        this.objectChange$.emit(updatedObject);
        return this.setObject(key, updatedObject);
    };

    /**
     * Deletes a cached object with the given key.
     * 
     * @returns {any}
     */
    deleteObject(key) {
        
        return this.updateObject(key, {reset: true});
    }
}
