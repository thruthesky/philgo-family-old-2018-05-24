import { Component } from '@angular/core';
// import { SampleLoginPage } from '../login/login';
// import { SampleHomePage } from '../home/home';
import { Member, MEMBER_DATA, MEMBER_LOGIN_DATA, MEMBER_REGISTER_RESPONSE_DATA } from '../../v2/member';
//import * as _ from 'lodash';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})



export class SampleRegisterPage {
  form: MEMBER_DATA = <MEMBER_DATA>{}
  login: MEMBER_LOGIN_DATA;
  urlPhoto = 'assets/img/anonymous.gif';
  process : { loader?; error?; } = {};
  cordova: boolean = false;
  doneUpdateTest = false;
 
  constructor(private member: Member) {
    //this.checkLogin();
      this.setTemporaryValues();
  }
  checkLogin() {
      /*
    let x = this.member.logged();
    if ( x ) {
      this.loadUserProfile();
    }
    else {
      this.setTemporaryValues();
    }
    */
  }

  loadUserProfile() {
    this.member.data( re => {
      console.log('loginUserProfile(): re', re);
      /*
      this.form.name = re.user_name;
      this.form.email = re.user_email;
      this.form.mobile = re.user_mobile;
      this.form.gender = re.user_gender;
      this.form.birthday = re.birth_year + '-' + re.birth_month + '-' + re.birth_day;

      this.form.text_1 = re.user_text_1;
      */
    },
    e => {
      alert("error: " + e);
    })
  }
  setTemporaryValues(pre='') {
    let f = this.form;
    let d = new Date();
    f.id = "temp-" + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds();

    if ( ! pre ) f.password = 'pass-' + f.id;

    f.name = pre + 'name-' + f.id;
    if ( pre == '' ) f.nickname = 'nickname-' + f.id;
    else f.nickname = '';
    f.email = pre + 'email-' + f.id + '@gmail.com';
    f.mobile = pre + '10123456789';
    f.landline= pre + '9876543210';
    f.gender = pre ? 'M' : 'F';
    f.birthday = pre ? '1973-10-16' : '1234-56-78';
    f.address = pre + 'address-' + f.id;
    f.city = pre + 'city-' + f.id;
    f.province = pre + 'province-' + f.id;
    f.country = pre ? 'kr' : 'us';
    f.race = pre + 'race-' + f.id;
    f.children = pre + 'children-' + f.id;
    f.height = pre ? 174 : 200;
    f.weight = pre ? 74 : 100;
    f.eye_color = pre + 'eye_color-' + f.id;
    f.hair_color = pre + 'hair_color-' + f.id;
    f.religion = pre + 'religion-' + f.id;
    f.relationship = pre + 'relationship-' + f.id;
    f.smoking = pre ? 'N' : 'Y';
    f.drinking = pre ? 'Y' : 'N';
    f.look_for = pre ? 'M' : 'F';
    f.greeting = pre + 'greeting-' + f.id;
    f.signature = pre + 'signature-' + f.id;
    f.namecard_title = pre + 'namecard_title-' + f.id;
    f.namecard_company_name = pre + 'namecard_company_name-' + f.id;
    f.namecard_name = pre + 'namecard_name-' + f.id;
    f.namecard_line = pre + 'namecard_line-' + f.id;
    f.namecard_address = pre + 'namecard_address-' + f.id;
    f.namecard_landline = pre + 'namecard_landline-' + f.id;
    f.namecard_mobile = pre + 'namecard_mobile-' + f.id;
    f.namecard_homepage = pre + 'namecard_homepage-' + f.id;
    f.namecard_email = pre + 'namecard_email-' + f.id;


    if ( pre ) {
      for( let i = 10; i >= 1; i -- ) {
        f['int_' + i] = 10 - i;
        f['char_' + i] = (10 - i) + '';
        f['varchar_' + i] = pre + 'varchar+' + i;
        if ( i <= 5 ) {
          f['text_' + i] = pre + "This is " + i;
        }
      }
    }
    else {
      for( let i = 1; i <= 10; i ++ ) {
        f['int_' + i] = i;
        f['char_' + i] = (i-1) + '';
        f['varchar_' + i] = 'varchar+' + i;
        if ( i <= 5 ) {
          f['text_' + i] = "This is " + i;
        }
      }
    }

  }

    onClickRegister() {
      //console.log('onClickRegister():', this.form);
      this.process  = { 'loader': true };
      this.member.register( this.form, (login:MEMBER_REGISTER_RESPONSE_DATA) => {
        console.log('onClickRegister(), registration sucess: ', login );
        // alert("Registration Success!");
        // ==> copy registration data.
        this.login = {
          id: login.id,
          session_id: login.session_id
        };

        // ==> login test
        this.loginTest();
      },
      e => {
        console.log("onClickRegister() error: " + e);
        if ( e == 'json-parse-error' ) {
          this.process['error'] = 'Server Error. Please notify this to admin';
        }
        else this.process = { 'error': e };
      })
    }

    loginTest() {
      let req = { id: this.form.id, password: this.form.password };
      console.log('loginTest() req: ', req);
      //this.member.debug = true;
      this.member.login( req,
        login => {
          console.log('loginTest success: ', login);
          if ( login.session_id == this.login.session_id ) console.log("session_id match: OK");
          else console.error("session_id does not match: FAIL");
          this.userDataTest();
        },
        er => console.log('loginTest error: ', er),
        () => console.log('loginTest finished:' )
      );
    }
    userDataTest() {
      this.member.data( data => {
        console.log("userDataTest() data: ", data);
        for ( let i in this.form ) {
          if ( i == 'nickname' || i == 'action' || i == 'submit' || i == 'password' || i == 'birthday' || i == 'session_id') continue;
          if ( this.form[i] == data[i] ) console.info( i + ' match: OK');
          else console.error( i + ` match: FAIL. form vaue: ${this.form[i]} response value: ${data[i]}`);
        }
        // ==> userUpdateData();
        this.userUpdateTest();
      }, e => {
        console.log("error: ", e);
      }, () => {
        console.log("complete: ");
      });
    }

    userUpdateTest() {
      if ( this.doneUpdateTest ) return;
      this.doneUpdateTest = true;
      console.log('userUpdateData()');
      this.setTemporaryValues('1');
      this.member.update( this.form, login => {
        console.log("update success: ", login );
        // ==> login test
        this.loginTest();
      }, error => {
        console.error("update error: ", error );
        alert( error );
      });
    }


    /**
     * Update
     */
    onClickUpdate() {
      console.log('onClickUpdate()', this.form);
      this.process = { loader: true };
      //this.form.id = this.login.id;
      //this.form.session_id = this.login.session_id;
      this.member.register( this.form, () => {
        this.process = {};
        alert("Profile update success !");
      },
      e => {
        if ( e == 'json-parse-error' ) this.process = { 'error' : 'Server Error. Please notifiy this to admin' };
        else this.process =  { error: e };
      });
    }


    onClickBack(){
      alert('move to login page');
    }


    onClickPhoto() {

    }
 
    onClickDeletePhoto(){

    }

    onChangeFile($event){

    }

}


