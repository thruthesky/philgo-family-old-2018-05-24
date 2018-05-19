/**
 * @see ../../../README.md
 *
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Post, PAGE, PAGE_OPTION, POSTS, ONE_HOUR_STAMP } from '../../post';
@Component({
    selector: 'latest-component',
    templateUrl: 'latest-component.html'
})
export class LatestComponent {
    @Input() title: string = null;
    @Input() post_id: string = null;
    @Input() limit: number = 0;
    @Output() error = new EventEmitter();
    posts: POSTS = <POSTS> [];
    constructor( private post: Post ) {
        //console.log("LatestComponent::constructor()");
    }
    ngOnInit() {
        let option: PAGE_OPTION = {
            post_id: this.post_id,
            limit: this.limit,
            comment: 0,
            expire: ONE_HOUR_STAMP,
            fields: 'idx,idx_parent,subject,deleted,gid,good,no_of_comment,no_of_view,post_id,stamp'
        };
        //console.log("latest-component::ngOnInit() ", this.title, this.post_id, option);
        //this.post.debug = true;
        this.post.page( option, ( page: PAGE ) => {
            //console.log("latest page: ", page);
            this.posts = [];
            page.posts.map( ( v:any, i ) => {
                setTimeout( () => {
                    v.url = this.post.getPostUri( v );
                    v['length'] = ('' + v.no_of_comment).length;
                    this.posts.push( v );
                }, i * 50 );
            } );
        },
        error => {
            this.error.emit( error );
            //this.post.error( "latest-component error: " + error );
        },
        () => {});
    }
}
