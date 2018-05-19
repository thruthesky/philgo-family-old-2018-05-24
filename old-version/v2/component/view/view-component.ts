/**
 * @see ./README.md
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { POST } from '../../philgo-api-interface';
import { Post } from '../../post';
// import { EditComponent } from '../edit/edit-component';

// import { DomSanitizer } from '@angular/platform-browser'


@Component({
    selector: 'view-component',
    templateUrl: 'view-component.html',
})
export class ViewComponent {
    isPost: boolean = false;
    isComment: boolean = false;
    hideContent: boolean = false;

    @Input() show: boolean = false; // if set true, the create/edit form box shows.
    show_backup: boolean = false; // it remembers the first option of 'show'
    @Input() mode: string = null;
    @Input() post: POST = null; // it is comment or post.
    @Input() root: POST = null;
    @Input() login_id: string = null;

    active: boolean = false; // "active==true" means, the use is in editing.

    @Output() edit = new EventEmitter();
    @Output() error = new EventEmitter();
    @Output() notice = new EventEmitter();
    @Output() showImage = new EventEmitter();
    @Output() memberInfo = new EventEmitter();

    // is Cordova?
    cordova = true;

    //
    showLink: boolean = false;
    ln: string = null;
    constructor(
        // private sanitized: DomSanitizer,
        private postService : Post
    ) {
        // console.log("ViewComponent()");
        this.ln = postService.languageCode;
        //console.log('ln: ', this.ln);

        this.cordova = this.postService.isCordova();
    }
    ngOnInit() {

        this.show_backup = this.show;

        if ( this.post === void 0 || ! this.post ) return this.error.emit("View Component Error: post is null or empty.");



        // check if it is my post.
        if ( this.post.user_id !== void 0 ) {
            if ( this.post.user_id == this.login_id ) this.post['mine'] = true;
        }

        // date of the post
        try {
            this.post['date'] = this.postService.getDateTime( this.post['stamp'] );
        }
        catch (e) {}


        // check if the post is 'post' or 'comment'
        try {
            if ( this.post.idx_parent !== void 0 ) {
                this.isPost = this.post.idx_parent == '0';
                this.isComment = ! this.isPost;
            }
            else {
                // this.postService.error("ViewComponent::ngOnInit() no post.idx_parent");
            }
        }
        catch ( e ) {
            console.info("CATCH : ViewComponent::ngOnInit() idx_parent failed?");
        }

        // don't show photos that are already shown in the content.
        if ( this.post.photos && this.post.photos.length ) {
            // console.log("phtos: ", this.post.photos);
            let newArray = [];
            for( let photo of this.post.photos ) {
                let arr = this.postService.explode( '/', photo.url );
                let no = arr[ arr.length -1 ];
                let re = this.post.content.indexOf( no );
                if ( re == -1 ) newArray.push( photo );
                else {
                    // console.log("skip matched: ", no);
                }
            }
            this.post.photos = newArray;
        }

        // make complete url.
        this.post.content = this.post.content.replace( new RegExp('src="data/', 'g'), 'src="http://file.philgo.com/data/');


    }

    // safeHtml( html ) : string {
    //     return <string> this.sanitized.bypassSecurityTrustHtml( html );
    // }

    onClickReply( ) {
        this.show = true;
        this.active = true;
        this.mode = 'create-comment';
        // editComponent.initForm( this.mode ); // this may be a bug. DOM of editComponent does not exist but to call.
    }





    onClickEdit( post ) {
        //console.log("ViewComponent::onClickEdit()" );
        this.edit.emit( post );
        this.show = true;
        this.active = true;
        this.hideContent = true;
        if ( this.post.idx == '0' ) this.mode = 'post-edit';
        else this.mode = 'edit-comment';
    // this.editComponent.initForm( this.mode );
    }

    onClickDelete() {
        this.post['inDeleting'] = true;
        this.postService.delete( this.post.idx, re => {
            //console.log('delete: re: ', re);
            this.post.subject = "deleted";
            this.post.content = "deleted";
            // this.post['subject'] = "deleted";
            // this.post['content'] = "deleted";
            },
            error => this.error.emit("delete error: " + error ),
            () => this.post['inDeleting'] = false
        );
    }


    onClickReport() {
        //console.log("onClickReport()");
        //this.post.debug = true;
        this.post['inReport'] = true;
        this.postService.report( this.post.idx, re => {
            //console.log('report succes: re: ', re);
            this.notice.emit("report-success");
        },
        error => {
            //console.log("report failed: ", error);
            this.error.emit( error );
        },
        () => {
            this.post['inReport'] = false;
        });
    }


    onClickLike() {
        this.post['inLike'] = true;
        this.postService.vote( this.post.idx, re => {
            //console.log('delete: re: ', re);
            // this.postService.error("You have reported a post. Thank you.");
             this.post['inLike'] = false;
            this.post.good = (parseInt( this.post.good ) + 1).toString();
        },
        error => {
            this.error.emit( error );
              this.post['inLike'] = false;
            //console.log("like error: " + error );
        },
        () => {
            this.post['inLike'] = false;
        });
    }


    onEditComponentSuccess() {
        this.active = false;
        this.hideContent = false;
    }
    onEditComponentCancel() {
        this.show = this.show_backup;
        this.active = false;
        this.hideContent = false;
    }

    onEditComponentError( error ) {
        this.error.emit( error );
    }

    onClickFullView( url ) {
        this.showImage.emit( url );
    }

    onClickNickname( post ){
        this.memberInfo.emit( post );
    }


    // t( code ) {
    //     return this.postService.t( code, this.post );
    // }

}
