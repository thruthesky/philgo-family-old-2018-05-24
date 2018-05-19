import { Component, Input, Output, EventEmitter, NgZone, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Post, POST_RESPONSE, POST_DATA, POST, COMMENT } from '../../../../../api/philgo-api/v2/post';
import { Data, FILE_UPLOAD_RESPONSE, DATA_UPLOAD_OPTIONS } from '../../../../../api/philgo-api/v2/data';
//import { IonicApi } from '../../../../../providers/ionic-api-0.2/ionic-api';
//import { IONIC_PUSH_MESSAGE } from '../../../../../providers/ionic-api-0.2/ionic-share';
import * as _ from 'lodash';




declare let navigator: any;
declare var Camera;
@Component({
    selector: 'edit-component',
    templateUrl: 'edit-component.html'
})
export class EditComponent {


    @ViewChild('contentTextarea') contentTextarea: ElementRef;

    /**
     * This is needed to put newly created post on top of post list.
     */
    @Input() posts: any = null;
    /**
     * 'root' is the root post.
     *      - It is needed to 'create-comment'.
     *          - More specifically, it will be used to insert the created comment into view.
     *      - It is not needed on 'edit-comment' and post create/edit.
     *
     */
    @Input() root: POST = null;
    /**
     *  @Attention - variable 'current' is the current post or current comment.
     *
     *  If you want to reply of a post, 'current' is the post.
     *  If you want to edit post, 'current' is the post.
     *  If you want to reply of a comment, 'parent' is the comment you want to leave a comment on.
     *  If you want to edit a comment, 'current' is the comment.
     */
    @Input() post_id: string = null;
    @Input() current: POST;

    /**
     * If 'active' is set to true, then the form should be in full editing mode.
     *      - textarea is wide and taller enough.
     * If 'active' is set to false, then the form should be in minimal editing mode.
     *      - textarea should be in one line.
     *      - there may be camera button.
     *      - submit button may be hidden.
     */
    @Input() active: boolean = false; // adding '.show' CSS Class to FORM
    @Input() mode: 'create-post' | 'edit-post' | 'create-comment' | 'edit-comment' = null;
    @Output() postLoad = new EventEmitter();
    @Output() error = new EventEmitter();
    @Output() success = new EventEmitter();
    @Output() cancel = new EventEmitter();


    showProgress: boolean = false;
    progress: number = 0;
    widthProgress: any;
    //files: Array<FILE_UPLOAD_DATA> = <Array<FILE_UPLOAD_DATA>>[];
    temp = <POST_DATA> {};

    cordova: boolean = false;
    inDeleting: boolean = false;
    inPosting: boolean = false;
    inputFileValue: string = null;
    ln: string = null;
    constructor(
        private ngZone: NgZone,
        public post: Post,
        private data: Data,
        private sanitizer: DomSanitizer
//        private ionic: IonicApi
        ) {
        //console.log("EditComponent::constructor()");
        this.cordova = post.isCordova();
        this.ln = post.languageCode;


    }

    renderPage() {
        this.ngZone.run(() => {
            // console.log('ngZone.run()');
        });
    }

    ngOnInit() {
        this.initForm( this.mode );
        if ( this.active ) {
            setTimeout( () => this.contentTextarea.nativeElement.focus(), 100 );
        }
    }

    ngAfterViewInit() {
    }

    /**
     *
     * 폼 데이터 초기화
     *
     *      - 새 글/코멘트 쓰기에서는 gid 값만 초기화
     *      - 글/코멘트 수정에서는 내용 및 기타 필드를 temp 에 복사한다.
     *
     * @param mode -
     *
     *      "@Input() mode" 로 지정되어져 있고, parent 클래스에서 mode 의 값을 지정하지만, 값의 반영 속도가 좀 느린 것 같다.
     *      그래서 입력 값으로 mode 를 받아서, 바로 반영하고,
     *      폼의 데이터를 초기화 한다.
     *
     *      특히 상위 컴포넌트( view-component ) 에서 수정 버튼을 클릭 했을 때, 이 함수를 직접 호출하면서, mode 값을 지정한다.
     *      mode 를 지정하는 이유는 @Input() 바인딩에서 값 전달 속도가 느려서 인 것 같다.
     *
     *
     */
    initForm( mode? ) {
        if ( mode ) this.mode = mode;

        this.temp = <POST_DATA> {};
        this.temp.gid = this.post.uniqid(); // generate new gid for new post/comment.

        //console.log("EditComponent::initForm() current: ", this.current);
        //console.log("mode: ", this.mode);

        if ( this.mode == 'edit-post' || this.mode == 'edit-comment' ) { //
            // console.log('without loading. mode: ', this.mode);
            this.temp = _.cloneDeep( this.current );
            this.temp.content = this.post.strip_tags( this.temp.content );
        }

    }


    /**
     * When a user click on the form to input content of comemnt for creating a comment.
     */
    onActivateForm() {
        if ( this.active ) return; // active 할 때 마다, 내용을 초기화 하므로, 그냥 리턴한다.
        // console.log("onActivateForm: ", this.temp);
        this.initForm( 'create-comment' ); // onActivateForm() 에서는 무조건 'create-comment' 를 하면 된다.
        this.active = true; // add CSS class
        // console.log("activated");
        //


        setTimeout( () => this.contentTextarea.nativeElement.focus(), 100 );


    }

    onClickCancel() {
        this.active = false;
        this.cancel.emit();
    }



    /**
     * Query to philog server to create/edit a post/comment.
     */
    onClickSubmit() {

        //console.log("mode: ", this.mode);
        //console.log("current: ", this.current);
        //console.log("temp: ", this.temp);

        this.inPosting = true;
        if ( this.mode == 'create-comment' ) this.createComment();
        else if ( this.mode == 'edit-comment' ) this.editComment();
        else if ( this.mode == 'create-post' ) this.createPost();
        else if ( this.mode == 'edit-post' ) this.editPost();
        else {
            // this.error.emit("wrong mode");
        }

    }


    createPost() {
        this.temp.post_id = this.post_id;
        // console.log("temp:", this.temp);
        this.post.create( this.temp,
            s => this.successCallback( s ),
            e => this.errorCallback( e ),
            () => this.completeCallback()
        );
    }

    editPost() {
        this.temp.subject = ''; // to update subject from content.
        this.post.update( this.temp,
            s => this.successCallback( s ),
            e => this.errorCallback( e ),
            () => this.completeCallback()
        );
    }


    /**
     * Going to create a comment.
     */
    createComment() {
        this.temp.idx_parent = this.current.idx;

        this.temp.post_id = this.post_id;
        // console.log("createComment() temp:", this.temp);

        // this.post.debug = true;
        this.post.createComment( this.temp,
            re => {
                this.sendPushNotifications( re );
                this.successCallback( re );
            },
            e => this.errorCallback( e ),
            () => this.completeCallback()
        );
    }

    editComment() {
        // console.log("this.temp: ", this.temp);
        this.post.update( this.temp,
            s => this.successCallback( s ),
            e => this.errorCallback( e ),
            () => this.completeCallback()
        );
    }

    successCallback( re: POST_RESPONSE ) {
        // console.log( 'PhilGo API Query success: ', re);
        if ( this.mode == 'create-comment' ) {
            let post = this.root;
            let comment = <COMMENT> re.post;
            // console.log("post: ", post);
            if ( post.comments ) { // if there are other comments, insert it.
                let index = _.findIndex( post.comments, c => c.idx == this.current.idx ) + 1;
                // console.log('index: ', index);
                post.comments.splice(
                    index,
                    0,
                    comment
                );
                // post.comments.unshift( comment );
            }
            else post['comments'] = [ comment ]; // if there is no comments, give it in an array.
        }
        else if ( this.mode == 'edit-comment' ) {
            // this.current = <POST> re.post;
            this.current.content = re.post.content;
            if ( re.post['photos'] ) this.current['photos'] = re.post['photos'];
        }
        else if ( this.mode == 'edit-post' ) {
            this.current.subject = re.post.subject;
            this.current.content = re.post.content;
            if ( re.post['photos'] ) this.current['photos'] = re.post['photos'];
        }
        else if ( this.mode == "create-post" ) {

            try {
                if ( this.posts ) {
                    // console.log("posts: ", posts);
                    // console.log("re: ", re);
                    this.posts.unshift( re.post );
                }
            }
            catch ( e ) { this.post.error( "Caught in EditComponent::successCallback() 'create-post'", e ); }
        }
        this.active = false; // remove '.show' css class.  it cannot be inside this.clear()
        this.temp = {};
        this.success.emit();
    }

    /**
     * propagate to parent component.
     */
    errorCallback( error ) {
        // this.post.error( error );
        this.error.emit( error );
    }
    completeCallback() {
        this.inPosting = false;
    }


    /**
     * This is for web.
     */
    onChangeFile( event, post ) {
        //
        // console.log("onChangeCommentFile()");
        // console.log("this.comments: ", this.temp);
        this.showProgress = true;
        this.data.uploadPostFile( this.temp.gid, event,
            s => this.onSuccessFileUpload(s),
            f => this.onFailureFileUpload(f),
            c => this.onCompleteFileUpload(c),
            p => this.onProgressFileUpload(p)
        );
    }

    /**
     * This is for camera.
     */
    onClickFileUploadButton() {
        if ( ! this.cordova ) return;
        //
        // console.log("onClickCommentFileUploadButton()");

        let message = 'Please select how you want to take photo.';
        let camera = 'Camera';
        let gallery = 'Gallery';
        let cancel = 'Cancel';
        let title = 'Take Photo';
        if ( this.ln == 'ko' ) {
            message = '카메라에서 사진 찍기 또는 갤러리에서 가져오기를 선택하세요.';
            camera = '카메라';
            gallery = '갤러리';
            cancel = '취소';
            title = '사진 선택';
        }

        navigator.notification.confirm(
            message,
            i => this.onCameraConfirm( i ),
            title,           // title
            [camera, cancel, gallery]     // buttonLabels
        );


    }
    onCameraConfirm( index ) {
        // console.log("confirm: index: ", index);
        if ( index == 2 ) return;
        let type = null;
        if ( index == 1 ) { // get the picture from camera.
            type = Camera.PictureSourceType.CAMERA;
        }
        else { // get the picture from library.
            type = Camera.PictureSourceType.PHOTOLIBRARY
        }
        // console.log("in cordova, type: ", type);
        let options = {
            quality: 80,
            sourceType: type
        };
        navigator.camera.getPicture( path => {
            // console.log('photo: ', path);
            this.fileTransfer( path ); // transfer the photo to the server.
        }, e => {
            // console.error( 'camera error: ', e );
            //this.post.error("EditComponent::onCameraConfirm() : camera error");
        }, options);
    }

    fileTransfer( fileURL: string ) {
        this.showProgress = true;
        let options: DATA_UPLOAD_OPTIONS = {
            module_name: 'post',
            gid: this.temp.gid
        };

        this.data.transfer( options,
            fileURL,
            x => this.onSuccessFileUpload( x ),
            e => this.onFailureFileUpload( e ),
            c => {},
            p => this.onProgressFileUpload( p )
        );
    }



    onSuccessFileUpload (re: FILE_UPLOAD_RESPONSE) {
        // console.log('re.data: ', re.data);
        if ( this.temp.photos === void 0 ) this.temp['photos'] = [];
        this.temp.photos.push( re.data );
        // this.files.push( re.data );
        this.showProgress = false;
        this.renderPage();
    }
    onFailureFileUpload ( error ) {
        this.showProgress = false;
        this.post.error( "Error: EditComponent::onFailureFileUpload()" + error );// error );
    }
    onCompleteFileUpload( completeCode ) {
        // console.log("completeCode: ", completeCode);
    }
    onProgressFileUpload( p ) {
        // console.log("percentag uploaded: ", p);
        this.progress = p;
        this.widthProgress = this.sanitizer.bypassSecurityTrustStyle('width:'  + p + '%' );
        this.renderPage();
        this.renderPage();
    }


    onClickDeleteFile( file ) {

        let re = confirm("Do you want to delete?");
        if ( re == false ) return;

        // console.log("onClickDeleteFile: ", file);
        let data = {
            idx: file.idx
        };
        this.inDeleting = true;
        this.data.delete( data, (re) => {
            this.inDeleting = false;
            // console.log("file deleted: ", re);
            _.remove( this.temp.photos, x => {
                // console.log('x:', x);
                return x['idx'] == data.idx;
            } );
            // console.log( this.temp.photos );
        }, error => {
            this.inDeleting = false;
            this.post.error( "EditComponent::onClickDeleteFile(): " + error );
        } );

    }


    sendPushNotifications( re ) {
        //console.log("result of comment create: ", re.parents);
        let parents = re.parents;
        for ( let parent of parents ) {
            if ( parent.varchar_9 ) {
                //console.log("Going to send push notification!");
                // @todo replace sendPushNotification with FCM.
                // this.sendPushNotification( parent.varchar_9 );
            }
        }
    }

    // sendPushNotification( token ) {
    //     let option: IONIC_PUSH_MESSAGE = {
    //         token: token,
    //         title: "New Comment",
    //         content: "You have a new comment under your post. Please open your comment list."
    //     };
    //     this.ionic.sendPushNotification( option, () => {
    //         console.info("push notification OK");
    //     }, err => {
    //         console.error("push notification error: ", err);
    //     });

    // }

}
