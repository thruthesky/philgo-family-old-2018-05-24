import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from './api';
import { Member } from './member';
import { PHILGO_API_RESPONSE } from './philgo-api-interface';
export * from './philgo-api-interface';

export interface MESSAGE_LIST_OPTION {
    page_no?: number;
    limit?: number;
    key?: string;
    mode?: string;
};
export interface MESSAGE_FORM {
    id_recv: string;
    content: string;
};
export interface MESSAGE_CREATE_REQUEST extends MESSAGE_FORM {
    id: string;
    session_id: string;
    action: string;
    mode: string;
};

export interface MESSAGE {
    idx: string;
    idx_recv: string;
    idx_send: string;
    gid: string;
    to: any;
    from: {
        id: string;
        idx: string;
        nickname: string;
    };
    subject: string;
    subjct_org: string;
    content: string;
    content_org: string;
    stamp_create: string;
    stamp_open: string;
};

export type MESSAGES = Array<MESSAGE>;

export interface MESSAGE_LIST extends PHILGO_API_RESPONSE {
    messages: MESSAGES
};

@Injectable()
export class Message extends Api {
    constructor( http: Http, private member: Member ) {
        super( http );
    }

    list( option: MESSAGE_LIST_OPTION, successCallback: ( data: MESSAGE_LIST ) => void, errorCallback: (error: string) => void, completeCallback?: () => void ) {

        let login = this.getLoginData();
        if ( ! login ) {
            errorCallback('login-first');
            completeCallback();
            return;
        }
        
        if ( option.page_no === void 0 ) option.page_no = 1;
        let url: string = this.getUrl( 'message' );
        url += '&id=' + login.id;
        url += '&session_id=' + login.session_id;
        url += '&page_no=' + option.page_no;
        url += option.limit ? '&limit=' + option.limit : '';
        if ( option.key ) {
            url += '&mode=search';
            url += '&field=subject_content';
            url += '&key=' + option.key;
        }
        this.get( url, successCallback, errorCallback, completeCallback );
    }


    opened( idx, successCallback: ( data: any ) => void, errorCallback: (error: string) => void, completeCallback?: () => void ) {
        let url: string = this.getUrl( 'message' );
        url += '&mode=read';
        url += '&idx=' + idx;
        let login = this.getLoginData();
        url += '&id=' + login.id;
        url += '&session_id=' + login.session_id;

        this.get( url, successCallback, errorCallback, completeCallback );
    }



    /**
     * 
     * @code example
     
        this.form.id_recv = "newsman";
        this.form.content = "Oo...This is the content. okay";
        this.message.send( this.form, re => {
            console.log("message send success: ", re);
        },
        error => this.message.error("message sending error: " + error ),
        () => { }
        );

     * @endcode
     */
    send( form: MESSAGE_FORM, successCallback: ( data: any ) => void, errorCallback: (error: string) => void, completeCallback?: () => void ) {


        let login = this.getLoginData();
        if ( ! login ) {
            errorCallback('login-first');
            completeCallback();
            return;
        }
        
        let data: MESSAGE_CREATE_REQUEST = {
            action: 'message',
            mode: 'send',
            id: login.id,
            session_id: login.session_id,
            id_recv: form.id_recv,
            content: form.content
        };

        this.post( data,
            successCallback,
            errorCallback,
            completeCallback );
    }

    makeAllRead(successCallback: ( data: any ) => void, errorCallback: (error: string) => void, completeCallback?: () => void ) {
        let url: string = this.getUrl('message');
        url += '&mode=make-all-read';

        let login = this.getLoginData();
        if ( ! login ) {
            errorCallback('login-first');
            completeCallback();
            return;
        }

        url += '&id=' + login.id;
        url += '&session_id=' + login.session_id;
        this.get( url, successCallback, errorCallback, completeCallback );
    }


    delete( idx, successCallback: ( data: any ) => void, errorCallback: (error: string) => void, completeCallback?: () => void ) {
        let url: string = this.getUrl('message');
        url += '&mode=delete';
        url += '&idx=' + idx;
        let login = this.getLoginData();
        if ( ! login ) {
            errorCallback('login-first');
            completeCallback();
            return;
        }
        url += '&id=' + login.id;
        url += '&session_id=' + login.session_id;
        this.get( url, successCallback, errorCallback, completeCallback );
    }

}