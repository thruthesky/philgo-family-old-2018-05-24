import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api, PHILGO_MEMBER_LOGIN } from './api';
import { MEMBER_DATA, MEMBER_LOGIN_DATA, PHILGO_RESPONSE, MEMBER_REGISTER_RESPONSE_DATA } from './philgo-api-interface';
export * from './philgo-api-interface';
// import * as _ from 'lodash';



@Injectable()
export class Member extends Api {

    
    constructor( http: Http ) {
        super( http );
    }


/*
    load( id: string ) {
        console.log('Member:load(): ', id);
    }
    */

    getLoginBody( loginData: MEMBER_LOGIN_DATA ) {
        loginData['action'] = 'login';
        //let body = this.buildQuery( loginData );
        //console.log('getLoginBody(): ', body);
        //return body;
        return loginData;
    }
    /*
    getRegisterBody( userData: MEMBER_DATA ) {
        userData['action'] = 'member_register_submit';
        let body = this.buildQuery( userData );
        //console.log('getRegisterBody(): ', body);
        return body;
    }
    */


    /**
     * 
     * @code example
            this.member.login( this.loginData,
                login => console.log('login success: ', login),
                er => this.member.error("login error:" + er),
                () => console.log('login complete!')
            );
     * @endcode
     * 
     */
    login( loginData: MEMBER_LOGIN_DATA, successCallback: (login:MEMBER_LOGIN_DATA) => void, errorCallback: (error:string) => void, completeCallback?: () => void ) {
        let body = this.getLoginBody( loginData );
        this.post( body, ( data: PHILGO_RESPONSE ) => {
            // console.log("login() : data : ", data );
            let login: MEMBER_LOGIN_DATA = {
                id: data.user_id,
                session_id: data.session_id,
                idx: data.idx_member,
                stamp: data.user_stamp
            };
            this.setLoginData( login );
            successCallback( login );
        },
        errorCallback,
        completeCallback);
        /*
        this.http.post( this.serverUrl, body, this.requestOptions )
            .subscribe( re => {
                try {
                    let data = JSON.parse( re['_body'] );
                    console.log( data );
                    if ( this.isRequestError( data ) ) return errorCallback( data['message'] );
                    let login: MEMBER_LOGIN_DATA = {
                        id: data.user_id,
                        session_id: data.session_id
                    };
                    this.setLoginData( login );
                    successCallback( login );
                }
                catch( e ) {
                    console.log('login(): re: ', re);
                    errorCallback( 'json-parse-error' );
                }
            });
            */
    }
    register( userData: MEMBER_DATA, successCallback: ( login: MEMBER_REGISTER_RESPONSE_DATA ) => void, errorCallback: (error: string) => void, completeCallback?: () => void ) {
        userData['action'] = 'member_register_submit';
        userData['login'] = 'pass';
        this.post( userData, re => {
            this.setLoginData( re );
            successCallback( re );
        },
        errorCallback,
        completeCallback);
/*
        console.log(this.serverUrl);
        console.log(body);
        this.http.post( this.serverUrl, body, this.requestOptions )
            .subscribe( re => {
                try {
                    let data = JSON.parse( re['_body'] );
                    console.log('register::callback() data: ', data);
                    //if ( data['code'] )
                    if ( this.isRequestError(data) ) return errorCallback( data['message'] );
                    console.log('register::sucess: ', data);
                    this.setLoginData( data );
                    successCallback();
                }
                catch( e ) {
                    console.log(re);
                    errorCallback('json-parse-error');
                }
            });
            */

    }
    update( userData: MEMBER_DATA, successCallback: ( login: MEMBER_LOGIN_DATA ) => void, errorCallback: (error: string) => void, completeCallback?: () => void ) {
        let login = this.getLoginData();
        if ( login === void 0 || login.id === void 0 ) errorCallback('login-first');
        if ( userData['nickname'] ) errorCallback('cannot-edit-nickname');
        userData['id'] = login.id;
        userData['session_id'] = login.session_id;
        userData['action'] = 'member_register_submit';
        this.post( userData, re => {
            this.setLoginData( re );
            successCallback( re );
        },
        errorCallback,
        completeCallback);
    }
    


    /**
     * Sets user login id & session_id.
     * 
     * This 'setLoginData()' method must be here while 'getLoginDta()' is on parent class.
     */
    setLoginData( data ) : void {
        let login = { id: data.id, session_id: data.session_id };
        let str = JSON.stringify( login );
        localStorage.setItem( PHILGO_MEMBER_LOGIN, str );
    }




    logout() {
        localStorage.removeItem( PHILGO_MEMBER_LOGIN );
    }

    /**
     * Retruns login data saved in localStroage.
     */
    logged () {
        return this.getLoginData();
    }


    /**
     * Gets user data.
     * @note this method only gets self data with the session information saved in localStorage.
     * @note 현재 로그인 한 사용자의 데이터만 가져 올 수 있다.
     * 
     */
    data( successCallback: (data: MEMBER_DATA) => void, errorCallback?: (error: string) => void, completeCallback?: () => void ) {
        let login = this.logged();
        if ( login ) {
            let url = this.getUrl('version&user_extra=1&id=' + login.id + '&session_id=' + login.session_id );
            // console.log('member.data() url: ', url);
            this.get( url, successCallback, errorCallback, completeCallback );
            /*
            console.log('data: ', url);
            this.http.get( url )
                .subscribe( re => {
                    // console.log('version: ', re);
                    try {
                        let data = JSON.parse( re['_body'] );
                        successCallback( data );
                    }
                    catch( e ) {
                        errorCallback('json-parse-error');
                    }
                });
                */
        }
        else return errorCallback('not logged in');
    }

}