/**
 * Miscellaneous helper class.
 * 
 * @note this class will hold all other methods that are not part of
 *  member, post, message, data(files).
 * 
 * @note if this class gets bigger, then try to make it slime by separating into a new class.
 * 
 */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from './api';
import { POINT_UPDATE_REQUEST, POINT_UPDATE_RESPONSE } from './philgo-api-interface';


@Injectable()
export class Philgo extends Api {
    constructor( http: Http ) {
        super( http );
    }


    /**
     * 
     * 
     * 
     * @code
     
        let data: POINT_UPDATE_REQUEST = {
            etc: 'alpha-test'
        };
        philgo.pointUpdate( data,
            ( re: POINT_UPDATE_RESPONSE )=> {
                console.info( re );
            },
            ( error: string ) => {
                console.error( error );
            },
            () => {
                console.log('complete');
            }
        );

        
     * @endcode
     */
    pointUpdate( data: POINT_UPDATE_REQUEST, successCallback: ( re: POINT_UPDATE_RESPONSE ) => void, errorCallback: ( error : string ) => void, completeCallback?: () => void ) {
        data['action'] = 'point-update';
        let login = this.getLoginData();
        if ( ! login ) return errorCallback('login first');
        data.id = login.id;
        data.session_id = login.session_id;
        // this.debug = true;
        this.post( data,
            successCallback,
            errorCallback,
            completeCallback );
    }
    pointHistory() {

    }
    pointGet() {

    }

}