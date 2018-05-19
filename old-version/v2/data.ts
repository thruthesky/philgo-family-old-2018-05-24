import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from './api';
import { FILE_UPLOAD_RESPONSE, FILE_DELETE_RESPONSE, CODE_PRIMARY_PHOTO } from './philgo-api-interface';
import { Member } from './member';
export * from './philgo-api-interface';

import { FileUploader } from 'ng2-file-upload/file-upload/file-uploader.class';


export interface FileUploadResponse {
  success: boolean;
  item: any;
  response: any;
  status: any;
  headers: any;
};

export interface DATA_UPLOAD_OPTIONS {
    gid?: string;
    login?: string;
    module_name?: string;
    code?: string; // varname
    finish?: '0' | '1'; //
}


declare var FileUploadOptions;
declare var FileTransfer;



@Injectable()
export class Data extends Api {
    private uploader: FileUploader = Object();
    private result:FileUploadResponse = <FileUploadResponse> {};
    private urlFileServer: string = this.apiEndpointFileServer + "?module=ajax&submit=1&action=";
    constructor( http: Http, private member: Member ) {
        super( http );
    }

    /**
     * Returns file upload URL based on the options.
     *
     *
     *
     */
    getUploadUrl( options ) {
        let url = this.urlFileServer + 'file_upload_submit';

        //
        //
        if ( options.gid ) url += '&gid=' + options.gid;
        if ( options.login && options.login == 'pass' ) url += '&login=' + options.login;
        else {
            let login = this.member.getLoginData();
            if ( login ) {
                url += '&id=' + login.id;
                url += '&session_id=' + login.session_id;
            }
        }
        if ( options.module_name ) url += '&module_name=' + options.module_name;
        if ( options.code ) url += '&varname=' + options.code;
        if ( options.finish ) url += '&finish=' + options.finish;

        return url;
    }
    getUploadUrl_old( gid?: string, module_name?: string, code?: string, finish?: number, login?: string ) {
        let url = this.urlFileServer + 'file_upload_submit';

        //
        //
        if ( gid ) url += '&gid=' + gid;
        if ( login && login == 'pass' ) url += '&login=' + login;
        else {
            let login = this.member.getLoginData();
            if ( login ) {
                url += '&id=' + login.id;
                url += '&session_id=' + login.session_id;
            }
        }
        if ( module_name ) url += '&module_name=' + module_name;
        if ( code ) url += '&varname=' + code;
        if ( finish ) url += '&finish=1';

        return url;
    }

    /**
     * This does file upload.
     *
     *
     * @note if user has logged in, then it automatically send user authentication information to the server.
     *
     *
     * @note 회원 가입/수정 화면에서 사진을 등록 할 때,
     *          회원 가입하기 전에 사진을 업로드와 삭제를 위해서 'gid' 는 중요하다.
     *          하지만, 가입 후에는, gid 값은 반드시 넣어야 하는데, 엉터리 값을 넣으면 된다.
     *
     * @return void
     *      - If no file selected, it pass 2 through completeCallback().
     *      - If file upload success, it pass 0 through completeCallback().
     *      - If there was error, it pass 1 through completeCallback().
     */
    upload(
        options: DATA_UPLOAD_OPTIONS,
        event,
        successCallback: (data: FILE_UPLOAD_RESPONSE) => void,
        failureCallback: (error:string) => void,
        completeCallback?: ( code: number ) => void,
        progressCallback?: (progress:number) => void
        ) {
        let url = this.getUploadUrl( options );
        //console.log("Data::upload options and event, url ", options, event, url);
        this.uploader = new FileUploader({ url: url });

        let files;
        try {
            if ( event === void 0 || event.target === void 0 || event.target.files === void 0 ) {
                if ( completeCallback ) completeCallback( 2 );
                return;
            }
            files = event.target.files;
            if ( files === void 0 || files[0] == void 0 || ! files[0] ) {
                if ( completeCallback ) completeCallback( 2 );
                return;
            }
        }
        catch (e) {
            this.member.error("Please inform admin for this error: Data::upload() - no file error.");
            return;
        }


        this.initFileUpload( successCallback, failureCallback, completeCallback, progressCallback );
        try {
            this.uploader.addToQueue( files );
        }
        catch ( e ) {
            failureCallback( "Failed to addToQueue() onBrowserUpload()" );
        }
    }
    upload_old( files, successCallback: (data: FILE_UPLOAD_RESPONSE) => void, failureCallback: (error:string) => void, progressCallback?: (progress:number) => void) {
        //console.log("Data::upload()");
        /*


        // let url = this.getUrl('file_upload_submit');
        let url = this.urlFileServer + 'file_upload_submit';

        //
        //
        if ( files.gid !== void 0 ) {
            url += '&gid=' + files.gid;
            delete files.gid;
        }

        // login=pass 이면 회원 가입 없이 파일 업로드 한다.
        if ( files.login !== void 0 && files.login == 'pass' ) {
            url += '&login=' + files.login;
            delete files.login;
        }
        // login=pass 가 아니면, 무조건 회원 가입을 해야지만 파일 업로드를 할 수 있다.
        else {
            let login = this.member.getLoginData();
            if ( login ) {
                url += '&id=' + login.id;
                url += '&session_id=' + login.session_id;
            }
        }
        if ( files.varname !== void 0 ) {
            url += '&varname=' + files.varname;
            delete files.varname;
        }
        if ( files.module_name !== void 0 ) {
            url += '&module_name=' + files.module_name;
            delete files.module_name;
        }

        console.log("uplaod: ", url);
        this.uploader = new FileUploader({ url: url });
        this.initFileUpload( successCallback, failureCallback, progressCallback );
        try {
            this.uploader.addToQueue( files );
        }
        catch ( e ) {
            failureCallback( "Failed to addToQueue() onBrowserUpload()" );
        }
        */
    }

    /**
     * Deletes uploaded file.
     *
     *
     * @param data - data['idx'] 또는 data['gid'] 값이 반드시 들어와야 한다.
     * @note 회원 정보 사진을 관리(업로드,삭제) 할 때,
     *      회원 가입을 할 때,
     *          로그인/가입을 하지 않은 상태에서 파일을 업로드하면 'gid' 값을 입력해야하고, 그 'gid' 값으로 삭제를 해야 한다.
     *          로그인을 한 다음에는 파일 업로드/삭제를 할 때, 'idx_member' 를 사용하고 코드는 'priamry_photo' 로 고정되므로 gid' 에 엉터리 값이 들어가도 된다.
     *
     * @note 참고 : module/data/delte_submit.php 의 상단 코멘트를 참고한다.
     *
     * @note 파일을 삭제 할 때, gid 와 회원 로그인 정보를 같이 전달한다.
     *      이 둘 중에 맞는 것이 있으면 삭제를 한다.
     *
     * @code
     *
                let data = {
                    idx: idx,
                    gid: this.gid
                }
                this.data.delete( data, (re) => {
                    console.log("file deleted: idx: ", re.data.idx);
                    if ( silent === void 0 || silent !== true ) {
                        this.progress = 0;
                        this.urlPhoto = this.urlDefault;
                        this.inputFileValue = '';
                    }
                    this.uploadData = null;
                }, error => {
                    this.member.error( error );
                } );
     * @endcode
     */
     delete( data: { idx?: any, gid?: string }, successCallback: (re:FILE_DELETE_RESPONSE) => void, failureCallback: ( error: string) => void ) {
        let url = this.urlFileServer + "data_delete_submit";
        let login = this.member.getLoginData();
        if ( login ) {
            url += '&id=' + login.id;
            url += '&session_id=' + login.session_id;
        }
        if ( data.gid ) url += '&gid=' + data.gid;
        url += '&idx=' + data.idx;
        this.get( url, (re:FILE_DELETE_RESPONSE) => {
            if ( re.data.code ) failureCallback( re.data.message );
            else successCallback( re );
        }, failureCallback );
    }
    /**
     * This updates idx_member of 'gid'
     * 업로드된 파일 중 'gid' 에 해당하는 것을 찾아서 'idx_member' 를 업데이트 한다.
     * 이것은 회원 가입 페이지에서 사진 업로드를 먼저 하고, 회원 가입을 나중에 해서, 업로드된 사진의 소유를 가입된 회원의 것으로 변경하고자 할 때 사용한다.
     *
     * 참고로 게시판에서는 GID 만으로 충분하므로 별도로 idx_member 를 업데이트 하지 않는다.
     */
    updateMemberIdx( gid, successCallback, failureCallback ) {
        let login = this.getLoginData();
        let url = this.getUrl('data_update_idx_member')
             + '&gid=' + gid
             + '&id=' + login.id
             + '&session_id=' + login.session_id;
        //console.log(url);
        this.get( url, successCallback, failureCallback );
    }
    initFileUpload( successCallback: (data: FILE_UPLOAD_RESPONSE) => void,
        failureCallback: (error:string) => void,
        completeCallback?: ( code: number ) => void,
        progressCallback?: (progress:number) => void
    ) {
        //console.log('initFileUpload()');

        this.uploader.onSuccessItem = (item, response, status, headers) => {
            //console.log('onSuccessItem()');
            this.result = {
                "success": true,
                "item": item,
                "response": response,
                "status": status,
                "headers": headers
            };
            //console.log( 'onSuccessItem : ', this.result );
        };
        this.uploader.onErrorItem = (item, response, status, headers) => {
            //console.log('onFailureItem()');
            this.result = {
                "success": false,
                "item": item,
                "response": response,
                "status": status,
                "headers": headers
            };
            //console.log( 'onErrorItem : ', this.result );
        };
        this.uploader.onProgressItem = ( item, progress ) => {
            try {
                // console.info(progress);
                let p = parseInt( progress );
                let per = Math.round( p );
                if ( progressCallback ) progressCallback( per );
                //console.log("onProgressItem: ", per );
            }
            catch ( e ) {
                // console.error( progress );
            }
        };
        this.uploader.onCompleteAll = () => {
            // console.log("uploader.onCompleteAll()");
            // this.onBrowserUploadComplete();
            let re: FILE_UPLOAD_RESPONSE = null;
            try {
                re = JSON.parse( this.result['response'] );
            }
            catch ( e ) {
                // console.error("upload error: ", this.result['response'], e);
                failureCallback( 'json-parse-error' );
                if ( completeCallback ) completeCallback( 1 );
                return 0;
            }

            // check if philgo api.
            try {
                if ( re.code ) {
                    failureCallback( re.message );
                    if ( completeCallback ) completeCallback( 1 );
                    return;
                }
            }
            catch ( e ) {
                console.info( re );
                failureCallback( 'try caught: failure on checking error');
                if ( completeCallback ) completeCallback( 1 );
                return;
            }
            // check if philgo api backend error on file upload module. the error format is different from file delete submit.
            try {
                if ( re.data.result || re.data.error ) {
                    failureCallback( re.data.error );
                    if ( completeCallback ) completeCallback( 1 );
                    return;
                }
            }
            catch ( e ) {
                console.info( re );
                failureCallback( 'try caught: failure onchecking  backend error');
                if ( completeCallback ) completeCallback( 1 );
                return;
            }


            // file upload success.
            successCallback( re );
            if ( completeCallback ) completeCallback( 0 );

        };
        this.uploader.onAfterAddingFile = ( fileItem ) => {
            //console.log('uploader.onAfterAddingFile: begins to upload. ', fileItem);
            fileItem.withCredentials = false; // remove credentials
            fileItem.upload(); // upload file.
        }
    }





    /**
     * This does primary photo upload for users who are not logged in.
     *
     * @note Be sure you update idx_member after register.
     *
     * @param files - This is 'event' from HTML FORM INPUT type='file'
     *
     * @note uploadAnonymousPrimaryPhoto() 와 uploadPrimaryPhoto() 는 실패작이다.
     *  그냥 간단하게 upload() 함수 하나로 할 수 있는 것을
     *  오히려 복잡하게 꼬아 놓은 것 같다.
     *
     *  transfer() 함수를 보라. 따로 helper 함수 없이도 잘 된다.
     */
    uploadAnonymousPrimaryPhoto( gid: string, event, successCallback: (data: FILE_UPLOAD_RESPONSE) => void, failureCallback: (error:string) => void, completeCallback?: (completeCode: number) => void, progressCallback?: (progress:number) => void) {
        let options: DATA_UPLOAD_OPTIONS = {
            gid: gid,
            login: 'pass',
            code: CODE_PRIMARY_PHOTO,
            module_name: 'member',
            finish: '0'
        }
        this.upload( options, event, successCallback, failureCallback, completeCallback, progressCallback );
    }
    getUploadUrlAnonymousPrimaryPhoto( gid: string ) {
        let options: DATA_UPLOAD_OPTIONS = {
            gid: gid,
            login: 'pass',
            code: CODE_PRIMARY_PHOTO,
            module_name: 'member',
            finish: '0'
        }
        return this.getUploadUrl( options );
    }
    /**
     * If user logged in, use this method.
     * @note this does not need 'login'='pass', but the finish must be 1.
     */
    uploadPrimaryPhoto( event, successCallback: (data: FILE_UPLOAD_RESPONSE) => void, failureCallback: (error:string) => void, completeCallback?: (completeCode: number) => void, progressCallback?: (progress:number) => void) {
        let login = this.getLoginData();
        if ( ! login ) {
            failureCallback('login first');
            if ( completeCallback ) completeCallback( 1 );
        }
        let options: DATA_UPLOAD_OPTIONS = {
            gid: login.id,
            code: CODE_PRIMARY_PHOTO,
            module_name: 'member',
            finish: '1'
        }
        this.upload( options, event, successCallback, failureCallback, completeCallback, progressCallback );
    }
    getUploadUrlPrimaryPhoto() {
        let login = this.getLoginData();
        if ( ! login ) return '';
        let options: DATA_UPLOAD_OPTIONS = {
            gid: login.id,
            code: CODE_PRIMARY_PHOTO,
            module_name: 'member',
            finish: '1'
        }
        return this.getUploadUrl( options );
    }

    /**
     * Returns file.idx from a uploaded file url.
     */
    getIdxFromUrl( url: string ) : number {
        try {
            if ( url ) {
                let ar = url.split('/');
                return parseInt(ar[ ar.length - 1 ]);
            }
        }
        catch( e ) {
            return 0;
        }
    }


    /**
     *
     *
     *
     * @param gid
     * @param event
     * @param successCallback
     * @param failureCallback
     * @param completeCallback
     * @param progressCallback
     */
    uploadPostFile(
        gid: string,
        event,
        successCallback: (data: FILE_UPLOAD_RESPONSE) => void,
        failureCallback: (error: string) => void,
        completeCallback: (completeCode: number) => void,
        progressCallback: ( percentage: number ) => void
    ) {
        let options: DATA_UPLOAD_OPTIONS = {
            gid: gid,
            module_name: 'post',
            finish: '0'
        }
        this.upload( options, event, successCallback, failureCallback, completeCallback, progressCallback );
    }

    /**
     *
     * Upload photo on forum without login.
     *
     * @note You may set the idx_user after posting with updateMemberIdx()
     *
     * @param gid
     * @param event
     * @param successCallback
     * @param failureCallback
     * @param completeCallback
     * @param progressCallback
     */
    uploadPostFileAnonymous(
        gid: string,
        event,
        successCallback: (data: FILE_UPLOAD_RESPONSE) => void,
        failureCallback: (error: string) => void,
        completeCallback: (completeCode: number) => void,
        progressCallback: ( percentage: number ) => void
    ) {
        let options: DATA_UPLOAD_OPTIONS = {
            gid: gid,
            login: 'pass',
            module_name: 'post',
            finish: '0'
        }
        this.upload( options, event, successCallback, failureCallback, completeCallback, progressCallback );
    }



    /**
     * Transfers file to server using cordova-plugin-transfer.
     */
    transfer(
        options: DATA_UPLOAD_OPTIONS,
        fileURL: string,
        successCallback: (data: FILE_UPLOAD_RESPONSE) => void,
        failureCallback: (error:string) => void,
        completeCallback?: ( code: number ) => void,
        progressCallback?: (progress:number) => void
        ) {

        if ( fileURL === void 0 || ! fileURL ) {
            if ( completeCallback ) completeCallback( 2 );
            return;
        }

        let ft_options = new FileUploadOptions();
        ft_options.fileKey="file";
        ft_options.fileName=fileURL.substr(fileURL.lastIndexOf('/')+1);
        ft_options.mimeType="image/jpeg";
        let ft = new FileTransfer();
        let percentage = 0;

        ft.onprogress = progressEvent => {
            if ( progressEvent.lengthComputable ) {
                try {
                    // console.log("loaded:", progressEvent.loaded);
                    // console.log("total:", progressEvent.total);
                    percentage = Math.round( progressEvent.loaded / progressEvent.total );
                }
                catch ( e ) {
                    console.error( 'percentage computation error' );
                    percentage = 10;
                }
            }
            else percentage = 10; // progressive does not work. it is not computable.
            if ( progressCallback ) progressCallback( percentage );
        };

        let uri: string = this.getUploadUrl( options );
        /*
        let login = this.getLoginData();
        if ( login ) uri = this.getUploadUrlPrimaryPhoto();
        else uri = this.getUploadUrlAnonymousPrimaryPhoto( gid );
        */


        //console.log("file transfer to : ", uri);
        uri = encodeURI( uri );

        ft.upload(fileURL, uri, s => {
            //console.log("file upload success: Code = " + s.responseCode);
            //console.log("Response = " + s.response);
            //console.log("Sent = " + s.bytesSent);
            let re;
            try {
                re = JSON.parse( s.response );
            }
            catch ( e ) {
                failureCallback( "transfer try caught: JSON parse error on server response while file transfer..." );
                if ( completeCallback ) completeCallback( 1 );
                return;
            }


            // check if philgo api.
            try {
                if ( re.code ) {
                    failureCallback( re.message );
                    if ( completeCallback ) completeCallback( 1 );
                    return;
                }
            }
            catch ( e ) {
                console.info( re );
                failureCallback( 'transfer try caught: failure on checking error');
                if ( completeCallback ) completeCallback( 1 );
                return;
            }
            // check if philgo api backend error on file upload module. the error format is different from file delete submit.
            try {
                if ( re.data.result || re.data.error ) {
                    failureCallback( re.data.error );
                    if ( completeCallback ) completeCallback( 1 );
                    return;
                }
            }
            catch ( e ) {
                console.info( re );
                failureCallback( 'transfer try caught: failure onchecking  backend error');
                if ( completeCallback ) completeCallback( 1 );
                return;
            }
            successCallback( re );
            if ( completeCallback ) completeCallback( 0 );
        }, e => {
            // this.member.error("An error has occurred: Code = " + e.code);
            //console.log("upload error source " + e.source);
            //console.log("upload error target " + e.target);
            failureCallback( e.code );
            if ( completeCallback ) completeCallback( 1 );
        }, ft_options);

    }
}
