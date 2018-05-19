export const ONE_MINUTE_STAMP = 60;
export const ONE_HOUR_STAMP = 3600;
export const ONE_DAY_STAMP = 86400;
export const ONE_WEEK_STAMP = 604800;
export const ONE_MONTH_STAMP = 2678400;



export const CODE_PRIMARY_PHOTO = 'primary_photo';

export interface PHILGO_API_RESPONSE {
    acl?: string;
    action?: string;
    code?: number;
    domain?: string;
    event?: any;
    id?: string;
    idx_member?: string;
    message?: string;
    mode?: string;
    module?: string;
    post_id?: string;
    post_name?: string;
    register_mode?: string;
    session_id?: string;
    site?: string;
    user_id?: any;
    user_name?: string;
    user_stamp?: string;
    user_url_primary_photo?: string; // for user primary photo.
    version?: string;
    idx?: any; // for post/comment update.
    deleted?: string;
};
export interface PHILGO_RESPONSE extends PHILGO_API_RESPONSE {};

export interface MEMBER_DATA extends PHILGO_API_RESPONSE {
    idx?: string;
    stamp?: string;
  id?: string;
  nickname?: string;
  password?: string;
  name?: string;
  email?: string;
  mobile?: string;
  landline?: string;
  gender?: string;
  birth_year?:string;
  birth_month?:string;
  birth_day?:string;
  birthday?: string;

  address?: string;
  city?: string;
  province?: string;
  country?: string;
  race?: string;
  children?: string;
  height?: number;
  weight?: number;
  eye_color?: string;
  hair_color?: string;
  religion?: string;
  relationship?: string;
  smoking?: string;
  drinking?: string;
  look_for?: string;
  greeting?: string;
  signature?: string;
  namecard_title?: string;
  namecard_company_name?: string;
  namecard_name?: string;
  namecard_line?: string;
  namecard_address?: string;
  namecard_landline?: string;
  namecard_mobile?: string;
  namecard_homepage?: string;
  namecard_email?: string;

  int_1?: string;
  int_2?: string;
  int_3?: string;
  int_4?: string;
  int_5?: string;
  int_6?: string;
  int_7?: string;
  int_8?: string;
  int_9?: string;
  int_10?: string;

  char_1?: string;
  char_2?: string;
  char_3?: string;
  char_4?: string;
  char_5?: string;
  char_6?: string;
  char_7?: string;
  char_8?: string;
  char_9?: string;
  char_10?: string;

  varchar_1?: string;
  varchar_2?: string;
  varchar_3?: string;
  varchar_4?: string;
  varchar_5?: string;
  varchar_6?: string;
  varchar_7?: string;
  varchar_8?: string;
  varchar_9?: string;
  varchar_10?: string;

  text_1?: string; // as url of photo
  text_2?: string;
  text_3?: string;
  text_4?: string;
  text_5?: string;
};


export interface MEMBER_LOGIN_DATA {
    idx?: string;           // member.idx
    stamp?: string;         // member.stamp
    id?: string;            // member.id
    password?: string;      // member.password
    // idx?: string;           // member.idx. 회원 번호가 없이, 회원 아이디 + 세션 아이디로 로그인 가능하다.
    session_id?: string;    // member session_id
};
export interface MEMBER_LOGIN extends MEMBER_LOGIN_DATA {};


export interface MEMBER_REGISTER_DATA extends MEMBER_DATA {

};

export interface MEMBER_REGISTER_RESPONSE_DATA extends PHILGO_API_RESPONSE {

};

export interface POINT_UPDATE_REQUEST extends MEMBER_LOGIN {
    etc: string;           // point update code
};
export interface POINT_UPDATE_RESPONSE extends PHILGO_RESPONSE {

};



export interface FILE_UPLOAD_DATA {
    code?: string;
    idx: number;
    name?: string;
    path?: string;
    result?: number;
    error?: string;
    src_org?: string;
    url?: string;
    url_thumbnail?: string;
    gid?: string; // @Warning 'gid' is not returned from server. you must keep it by yourself.
};
export interface FILE_UPLOAD_RESPONSE extends PHILGO_API_RESPONSE {
    data: FILE_UPLOAD_DATA;
};

export interface FILE_DELETE_RESPONSE extends PHILGO_API_RESPONSE {
    data: {
        code: number;
        idx: number;
        message?: string;
    }
}



export interface SEARCH_QUERY_DATA {
    fields: string;
    from: string;
    on?: string;
    where?: string;
    orderby?: string;
    limit?: string;
    page?: number;
    post?: number;
};

export interface PAGE_DATA {
    post_id?: string;
    user_id?: string;
    page_no?: number;
    fields?: string;
    file?: number;
    limit?: number;
    limit_comment?: number;
    expire?: number;                // @see post.pageCache.
    comment?: number;
};

export interface PAGE_OPTION extends PAGE_DATA {}


export interface PHOTO_OPTION {
    post_id?: string;
    limit?: number;
    limit_comment?: number;
    comment?: number;
    page_no?: number;
};


export interface POST_AD {
    deleted: string;
    done_htmlspecialchars: number;
    idx: string;
    no_of_first_image: string;
    post_id: string;
    src: string;
    src_thumbnail: string;
    subject: string;
    url: string;
};

export interface POST_TOP_AD {
    category: string;
    gid: string;
    idx: string;
    idx_file: string;
    int_4: string;
    src: string;
    sub_category: string;
    url: string;
    varchar_5?: string;
    varchar_11?: string;
};

export interface POST_TOP_PREMIUM_AD {
    idx: string;
    image_src: string;
    no_of_view: string;
    region: string;
    src: string;
    sub_subject: string;
    subject: string;
    url: string;
    varchar_5?: string;
    varchar_11?: string;
    varchar_15?: string;
    varchar_19?: string;
};

export interface MEMBER {
    id: string;
    name: string;
    nickname: string;
};


export interface PHOTO {
    idx: number;
    url?: string;
    url_thumbnail?: string;
};



export interface COMMENT {
    bad?: string;
    blind?: string;
    content: string;
    deleted?: string;
    depth?: string;
    gid: string;
    good?: string;
    idx?: string;
    idx_member?: string;
    idx_parent: string;
    idx_root?: string;
    int_10?: string;
    member?: MEMBER;
    photos?: Array<PHOTO>;
    post_id?: string;
    stamp?: string;
    date?: string;
    user_name?: string;
};

export interface POST {
    bad: string;
    blind: string;
    category: string;
    comments: Array<COMMENT>;
    content: string;
    deleted: string;
    depth: string;
    gid: string;
    good: string;
    idx: string;
    idx_member: string;
    idx_parent: string;
    idx_root: string;
    int_10: string;
    link: string;
    member: MEMBER;
    no_of_comment: string;
    no_of_view: string;
    photos: Array< PHOTO >;
    post_id: string;
    stamp: string;
    date?: string;
    subject: string;
    user_id: string;
    user_name: string;
    url?: string;
};

export type ADS = Array<POST_AD>;
export type POST_TOP_ADS = Array<POST_TOP_AD>;
export type POST_TOP_PREMIUM_ADS = Array<POST_TOP_PREMIUM_AD>;
/**
 * 2016-12-16 기존 POSTS interface 의 이름이 잘못되었음. 그래서 POSTS 를 PAGES 로 변경하고, 새로운 POSTS 를 만들었음.
 */
export type POSTS = Array<POST>;
export interface PAGE extends PHILGO_API_RESPONSE {
    ads: ADS;
    page_no: number;
    post_id: string;
    post_name: string;
    post_top_ad: POST_TOP_ADS;
    post_top_premium_ad: POST_TOP_PREMIUM_ADS;
    posts: POSTS;
};
//export interface PAGE extends POSTS {} // correct naming.
export type PAGES = Array<PAGE>; // correct naming for array of page.




/**
 * Post data structure for create/update
 */
export interface POST_DATA {
    module?: string; // for crate/update
    action?: string; // for create/update
    id?: string; // user id to create/update.
    session_id?: string; // user id to create or update.
    idx?: string;
    stamp?: string;
    idx_member?: string;
    idx_root?: string;
    idx_parent?: string;
    list_order?: string;
    depth?: string;
    gid?: string;
    post_id?: string;
    group_id?: string;
    category?: string;
    sub_category?: string;
    reminder?: string;
    secret?: string;
    checked?: string;
    checked_stamp?: string;
    report?: string;
    blind?: string;
    no_of_comment?: string;
    no_of_attach?: string;
    no_of_first_image?: string;
    user_domain?: string;
    user_id?: string;
    user_password?: string;
    user_name?: string;
    user_email?: string;
    subject?: string;
    content?: string;
    content_stripped?: string;
    link?: string;
    stamp_update?: string;
    stamp_last_comment?: string;
    deleted?: string;
    no_of_view?: string;
    good?: string;
    bad?: string;
    access_code?: string;
    region?: string;
    photos?: Array< PHOTO >;
    int_1?: string;
    int_2?: string;
    int_3?: string;
    int_4?: string;
    int_5?: string;
    int_6?: string;
    int_7?: string;
    int_8?: string;
    int_9?: string;
    int_10?: string;

    char_1?: string;
    char_2?: string;
    char_3?: string;
    char_4?: string;
    char_5?: string;
    char_6?: string;
    char_7?: string;
    char_8?: string;
    char_9?: string;
    char_10?: string;

    varchar_1?: string;
    varchar_2?: string;
    varchar_3?: string;
    varchar_4?: string;
    varchar_5?: string;
    varchar_6?: string;
    varchar_7?: string;
    varchar_8?: string;
    varchar_9?: string;
    varchar_10?: string;
    varchar_11?: string;
    varchar_12?: string;
    varchar_13?: string;
    varchar_14?: string;
    varchar_15?: string;
    varchar_16?: string;
    varchar_17?: string;
    varchar_18?: string;
    varchar_19?: string;
    varchar_20?: string;
    text_1?: string;
    text_2?: string;
    text_3?: string;
    text_4?: string;
    text_5?: string;
    text_6?: string;
    text_7?: string;
    text_8?: string;
    text_9?: string;
    text_10?: string;

    member?: MEMBER;
};

export interface POST_RESPONSE extends PHILGO_API_RESPONSE {
    post: POST_DATA;
};
