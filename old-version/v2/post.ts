import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from './api';
import { Member } from './member';
import { PAGE, POST_DATA, PAGE_OPTION, POST_RESPONSE, POST, POSTS, PHOTO_OPTION } from './philgo-api-interface';
export * from './philgo-api-interface';
// import * as _ from 'lodash';

@Injectable()
export class Post extends Api {

    constructor( http: Http, private member: Member ) {
        super( http );
    }

    hasError( data: POST_DATA ) : boolean | string {

        if ( data.id === void 0 ) return 'user-id-is-empty-login-first';
        if ( data.session_id === void 0 ) return 'session_id-is-empty';
        if ( data.action === void 0 ) return 'action-is-empty';

        if ( data.action == 'post_write_submit' ) {
            if ( data.post_id === void 0 ) return 'post-id-is-empty';
            if ( data.gid === void 0 ) return 'gid-is-empty';
            // if ( data.subject === void 0 ) return 'subject-is-empty'; // empty subject is ok.
        }
        else if  ( data.action == 'post_edit_submit' ) { // 글/코멘트 수정.
            if ( data.idx === void 0 ) return 'idx-is-empty';
            if ( data.idx_parent === void 0 || ! data.idx_parent ) { // 글인 경우만, 제목 체크.
                if ( data.subject === void 0 ) return 'subject-is-empty';
            }
        }
        else if  ( data.action == 'comment_write_submit' ) {
            if ( data.idx_parent === void 0 ) return 'idx_parent-is-empty';
        }
        else if ( data.action == 'post_delete_submit' ) {
            if ( data.idx === void 0 ) return 'idx-is-empty';
            else return false;
        }
        return false;
    }
    getError( data: POST_DATA ) : string {
        return <string> this.hasError( data );
    }


    create( data: POST_DATA, successCallback: ( re: POST_RESPONSE ) => void, errorCallback: ( error: string ) => void, completeCallback?: () => void ) {
        data['action'] = 'post_write_submit';
        let login = this.getLoginData();
        if ( login ) {
            data.id = login.id;
            data.session_id = login.session_id;
        }
        if ( this.hasError( data ) ) {
            errorCallback( this.getError( data ) );
            if ( completeCallback ) completeCallback();
            return;
        }
        this.post( data,
            successCallback,
            errorCallback,
            completeCallback );
    }
    createComment( data: POST_DATA, successCallback: ( re: POST_RESPONSE ) => void, errorCallback: ( error: string ) => void, completeCallback?: () => void ) {
        data['action'] = 'comment_write_submit';
        let login = this.getLoginData();
        if ( login ) {
            data.id = login.id;
            data.session_id = login.session_id;
        }
        if ( this.hasError( data ) ) {
            errorCallback( this.getError( data ) );
            if ( completeCallback ) completeCallback();
            return;
        }
        // this.debug = true;
        this.post( data,
            successCallback,
            errorCallback,
            completeCallback );
    }

    /**
     * This updates post/comment.
     * @attention it checks login for post update.
     */
    update( data: POST_DATA, successCallback: ( re: POST_RESPONSE ) => void, errorCallback: ( error: string ) => void, completeCallback?: () => void ) {
        data['action'] = 'post_edit_submit';
        let login = this.getLoginData();
        if ( ! login ) return errorCallback('login first');
        data.id = login.id;
        data.session_id = login.session_id;
        if ( this.hasError( data ) ) {
            errorCallback( this.getError( data ) );
            if ( completeCallback ) completeCallback();
            return;
        }
        this.post( data,
            successCallback,
            errorCallback,
            completeCallback );
    }

    /**
     * @attention - It does not do 'GET' request. it gets data of a post.
     * @note this method name has changed from 'get()' to 'load()'.
     */
    load( idx, successCallback: ( re: POST_RESPONSE ) => void, failureCallback: ( error: string ) => void, completeCallback?: () => void ) {
        let i = parseInt( idx );
        if ( ! i ) {
            failureCallback("wrong idx_post. it is not a number");
            if ( completeCallback ) completeCallback();
            return;
        }
        let url = this.getUrl( 'post_get_submit&idx=' + i );
        super.get( url,
            successCallback,
            failureCallback,
            completeCallback );
    }

    delete( idx, successCallback: ( re: any ) => void, errorCallback: ( error: string ) => void, completeCallback?: () => void ) {
        let data = {};
        data['idx'] = idx;
        data['action'] = 'post_delete_submit';
        let login = this.getLoginData();
        if ( login ) {
            data['id'] = login.id;
            data['session_id'] = login.session_id;
        }
        if ( this.hasError( data ) ) {
            errorCallback( this.getError( data ) );
            if ( completeCallback ) completeCallback();
            return;
        }
        this.post( data,
            successCallback,
            errorCallback,
            completeCallback );
    }

    report( idx, successCallback: ( re: any ) => void, errorCallback: ( error: string ) => void, completeCallback?: () => void ) {
        let data = {};
        data['idx'] = idx;
        data['action'] = 'post_report_submit';
        let login = this.getLoginData();
        if ( login ) {
            data['id'] = login.id;
            data['session_id'] = login.session_id;
        }
        if ( this.hasError( data ) ) {
            errorCallback( this.getError( data ) );
            if ( completeCallback ) completeCallback();
            return;
        }
        this.post( data,
            successCallback,
            errorCallback,
            completeCallback );
    }

    vote( idx, successCallback: ( re: any ) => void, errorCallback: ( error: string ) => void, completeCallback?: () => void ) {
        let data = {};
        data['idx'] = idx;
        data['action'] = 'post_vote_submit';
        let login = this.getLoginData();
        if ( login ) {
            data['id'] = login.id;
            data['session_id'] = login.session_id;
        }
        if ( this.hasError( data ) ) {
            errorCallback( this.getError( data ) );
            if ( completeCallback ) completeCallback();
            return;
        }
        this.post( data,
            successCallback,
            errorCallback,
            completeCallback );
    }


    /**
     * 
     * Get a page of posts from a forum. You can set cache option.
     * 
     * @use this to load posts of forum.
     *
     *
     * @note first page automatically cache.
     *  when 'data.page_no' == 1,
     *      1. load from cache & return data.
     *      2. load from server & cache & return data.
     *
     * @param If 'data.expire' is set, then it calls Post.pageCahce().
     *
     * @code example

        this.post.page( {post_id: this.post_id, page_no: 1}, (posts: POSTS) => {
            console.log('posts:', posts);
            console.log('point ad title: ', posts.ads[0].subject);
            console.log('comment user name: ', posts.posts[0].comments[0].member.name);
        }, e => {
            this.error(e);
        });

     * @endcode
     *
     */
    page( data: PAGE_OPTION, successCallback: ( page: PAGE ) => void, errorCallback: ( error: string ) => void, completeCallback: () => void ) {
        data.page_no = data.page_no ? data.page_no : 1;
        data.limit = data.limit ? data.limit : 30;
        data.fields = data.fields ? encodeURIComponent( data.fields ) : '';
        let url = this.getUrl() + 'post-list&page_no=' + data.page_no + '&limit=' + data.limit + '&fields=' + data.fields;
        if ( typeof data.user_id != 'undefined'  ) url += "&user_id=" + data.user_id;
        if ( typeof data.post_id != 'undefined'  ) url += "&post_id=" + data.post_id;
        if ( typeof data.comment != 'undefined'  ) url += "&comment=" + data.comment;
        if ( typeof data.limit_comment != 'undefined' ) url += "&limit_comment=" + data.limit_comment;
        if ( typeof data.file != 'undefined' ) url += "&file=" + data.file;

        let login = this.member.logged();
        if ( login ) url += '&id=' + login.id + '&session_id=' + login.session_id;
        data['url'] = url;
        // if ( data.post_id == 'news' ) console.log('url: ', url);
        if ( data.expire !== void 0 ) return this.pageCache( data, successCallback, errorCallback, completeCallback );

        if ( this.debug ) console.log("page() url: ", url);
        // console.log('data:', data);

        let cache_id = this.getPostListCacheId( data );
        if ( data.page_no == 1 ) {
            // console.log("page no: 1");
            //console.log("page() url: ", url);
            this.cacheCallback( cache_id, successCallback );
        }

        // console.log('page(): url: ', url);
        /*
        this.get( url, re => {

        }, errorCallback );
        */
        /*
        this.http.get( url )
            .subscribe( re => {
                // console.log('post::page() re: ', re);
                this.responseData( re, (posts: POSTS) => {
                    if ( data.page_no == 1 ) this.saveCache( data.post_id, posts );
                    successCallback( posts );
                }, errorCallback );
            });
        */
        this.get( url, (page: PAGE) => {
            if ( data.page_no == 1 ) this.saveCache( cache_id, page );
            successCallback( page );
        }, errorCallback, completeCallback );
    }


    /**
     *
     * This gets posts of a page.
     * It's mostly the same except it caches the posts of the page until 'option.expire' expires.
     * This method is separated to reduce the complexity of page().
     *
     * @note (ko) 이 함수는 기본적으로 page() 함수와 동일하다.
     *  다만,
     *      - option.expire 가 될 때까지 기존의 캐시 데이터를 사용한다.
     *      - 이 때, expire 해도 데이터를 삭제하지 않는다. 즉, 계속 기존 데이터를 사용하는데,
     *      - expire 하면, 인터넷으로 새로운 데이터를 가져와서 캐시를 덮어쓴다.
     *          - 만약, 인터넷이 안되면, 기존의 캐시를 계속 쓴다.
     *          - expire 된 경우, 캐시만 업데이트하고, successCallback() 은 두번 호출하지않는다.
     *
     *
     * @note but you can still use "Post.page()"" to call Post.pageCache(). @see Post.page()
     *
     * @note cache option
     *
     *  IF option.expire = seconds to use cached data.
     *      1. see if there is cache on that 'option.page_no'
     *      2. if yes,
     *          2.1 callback the cache data
     *                      ; getCache() will delete the data if the data is expired.
     *          2.2 RETURN.
     *      3. if no,
     *          3.1 get posts of the page no.
     *          3.2 callback the page.
     *          3.3 cache the page
     *          3.4 RETURN.
     *
     *
     * @code
     *
        let option: PAGE_OPTION = {
            post_id: this.post_id,
            limit: 6,
            expire: 30,
            fields: 'idx,idx_parent,subject,deleted,gid,good,no_of_comment,no_of_view,post_id,stamp'
        };
        this.post.page( option, ( page: PAGE ) => {
            console.log("latest: ", page);
            this.posts = page.posts;
        },
        error => this.error( error ),
        () => {});

     * @endcode
     *
     */
    pageCache( option: PAGE_OPTION, successCallback: ( page: PAGE ) => void, errorCallback: ( error: string ) => void, completeCallback?: () => void ) {
        //console.log("pageCache() : ", option);
        let cache_id = this.getPostListCacheId( option );
        let cache_page = this.getCache( cache_id, option.expire );
        if ( cache_page ) {
            //console.info("use cached data");
            successCallback( <PAGE> cache_page );
            completeCallback();
        }
        /**
         * If this code runs, successCallback() may be called again but only once every expire.
         */
        if ( this.isCacheExpired( cache_id, option.expire ) ) {
            //console.info("Cache expired. Going to cache");
            //let url = this.getUrl() + 'post-list&post_id=' + option.post_id + '&page_no=' + option.page_no + '&limit=' + option.limit + '&fields=' +option.fields;
            this.get( option['url'], (page: PAGE) => {
                //console.info("Got new page. Set cache:", page);
                if ( ! cache_page ) successCallback( page ); // does not recall successCallback() if already called.
                this.setCache( cache_id, page );
            }, errorCallback, completeCallback );
        }
    }

    getPostListCacheId( option: PAGE_OPTION ) {
        let id = 'cache-' + option.post_id + '-' + option.page_no + '-' + option.limit + '-';
        if ( option.user_id ) id = id + option.user_id;
        return id;
    }

    /**
     * Returns forum category
     * 게시판 종류를 리턴한다.
     *
     * @code simple example
     *      this.post.getForums( re => console.log(re), e => this.error(e) );
     * @endcode
     * @code example code
        this.post.getForums( data => {
            console.log(data);
        }, e => {
            console.log('getForum() error: ', e);
        });
     * @endcode
     */
    getForums( successCallback: (data: any) => void, errorCallback?: (error: string) => void, completeCallback?: () => void ) {
        // console.log('getForums()');
        // check if it has cached data.
        let url = this.getUrl('forums');
        // console.log('url:', url);
        this.get( url, successCallback, errorCallback, completeCallback );

        /*
        this.http.get( url )
            .subscribe( re => {
                this.responseData( re, successCallback, errorCallback );
            });
            */
    }


    /**
     *
     * latesetPhotos 는 첫번째 페이지인 경우, 1시간 캐시를 한다.
     *
     * @param option[expire] - use cached data until expires.
     *
     *
     * @code
            post.latestPhotos( { limit: 3 }, (posts: POSTS) => {
                console.log("posts: ", posts);
                this.photos = posts;
            })

            // template
            <div *ngIf=" photos ">
                <div *ngFor = " let post of photos ">
                <img [src]="post.photos[0].url_thumbnail">
                </div>
            </div>

     * @endcode
     */
    latestPhotos( option: PHOTO_OPTION, successCallback: ( posts: POSTS ) => void, errorCallback?: ( error: string ) => void, completeCallback?: () => void ) {
        let url = this.getUrl('latest-photo');
        if ( option.post_id ) url += '&post_id=' + option.post_id;
        if ( option.limit ) url += '&limit=' + option.limit;
        if ( option.limit_comment ) url += '&limit_comment=' + option.limit_comment;
        if ( option.comment ) url += '&comment=' + option.comment;
        let login = this.member.logged();
        if ( login ) url += '&id=' + login.id + '&session_id=' + login.session_id;

        option['page_no'] = option['page_no'] ? option['page_no'] : 1;
        url += '&page_no=' + option.page_no;
//        console.log('url', url);

        let o = { url: url };
        if ( option.page_no == 1 ) o['expire'] = option['expire'] ?  option['expire'] : 3600;
        this.get( o, ( data: PAGE ) => {
            successCallback( data.posts );
        }, errorCallback, completeCallback );
    }

    getSiteUrl() {
        return location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
    }

    /**
     * Returns URL in the form of "http://www.abc.com/article/123456";
     * @code
     *
     *
      post['url'] = this.post.getPermalink( post );

     * @endcode
     *
     */
    getPermalink( post: POST, tag = 'article' ) {
        let full = this.getSiteUrl();
        full += this.getPostUri( post, tag );
        return full;
    }

    /**
     * Returns URL in the form of "http://www.abc.com/forum/forum-name/123456";
     *
     */
    getPermalinkWithForumId( post: POST ) {
        return this.getSiteUrl() + this.getPostUri( post, 'forum/' + post.post_id );
    }

    getPostUri( post: POST, tag? ) : string {
        if ( post === void 0 ) { console.error("getLink() : post is void"); return ''; }
        if ( post.idx === void 0 ) { console.error("getLink() : post.idx is void"); return null; }

        if ( tag === void 0 ) tag = 'forum/' + post.post_id;
        return '/' + tag + '/' + post.idx;
    }


}
