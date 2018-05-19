import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Member, MEMBER_LOGIN_DATA } from '../../v2/member';
// import { SampleRegisterPage } from '../register/register';
// import { SampleHomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})


export class SampleLoginPage {

  status : { loader?; error?; success?; } = {};
  loginData: MEMBER_LOGIN_DATA = <MEMBER_LOGIN_DATA> {};
  constructor(
    private router: Router,
    private member: Member) { }

  onClickLogin() {
    this.status = { 'loader' : true };
    this.member.login( this.loginData,
      login => { console.log('login success: ', login), this.status = { 'success': 'login success' }; },
      er => { alert("login error:" + er); this.status.error = er },
      () => { console.log('login complete!'); this.status.loader = false; }
    );

    /*
      this.member.login( this.loginData, ( login: MEMBER_LOGIN_DATA ) => {
        alert('Login success !');
      },
      e => {
        this.process = { 'error' : e };
      });
      */
  }

}


