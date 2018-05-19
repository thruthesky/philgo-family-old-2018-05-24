import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Member, MEMBER_LOGIN_DATA } from '../../v2/member';
import { Post, SEARCH_QUERY_DATA } from '../../v2/post';
// import { SampleLoginPage } from '../login/login';
// import { SampleRegisterPage } from '../register/register'
@Component({
  selector: 'philgo-test-home',
  templateUrl: 'home.html'
})
export class SampleHomePage {
  login: MEMBER_LOGIN_DATA = <MEMBER_LOGIN_DATA> {};
  userData;
  constructor( public router: Router, private member: Member, private post: Post ) {
    console.log(member);
    member.version( v => console.log('version: ', v), e => console.log('version error: ', e) );
    this.checkLogin();
  }

  onClickGetForum() {
    this.post.getForums(
      re => console.log("success: ", re),
      er => console.log("error: ", er),
      () => console.log("GetForum : complete")
    )
  }

  checkLogin() {
    this.login = this.member.logged();
  }

  onClickLogout() {
    this.member.logout();
    this.checkLogin();
  }

  onClickProfile() {
    this.member.data( data => {
      this.userData = data;
    }, er => {
      alert("loading user data failed: " + er);
    })
  }

  onClickSearch() {
    console.log("search()");

    let data = <SEARCH_QUERY_DATA> {};
    data.fields = "name, email";
    data.from = "sf_member";
    this.post.search( data, re => {
      console.log("search result: ", re);
    }, error => alert("error on search: " + error ) );
  }
}
