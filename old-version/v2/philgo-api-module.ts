import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { Post } from './post';
import { Member } from './member';
import { Data } from './data';
import { Message } from './message';
import { Philgo } from './philgo';

import { SampleHomePage } from '../sample-pages/home/home';
import { SampleLoginPage } from '../sample-pages/login/login';
import { SampleRegisterPage } from '../sample-pages/register/register';
import { SamplePostPage } from '../sample-pages/post/post';
import { ViewComponent } from './component/view/view-component';
import { EditComponent } from './component/edit/edit-component';
import { LatestComponent } from './component/latest/latest-component';

export let ROUTES = [
        { path: "test/philgo/home", component: SampleHomePage, name: 'philgoHome' },
        { path: "test/philgo/login", component: SampleLoginPage, name: 'philgoLogin' },
        { path: "test/philgo/register", component: SampleRegisterPage, name: 'philgoRegister' },
        { path: "test/philgo/post", component: SamplePostPage, name: 'philgoPost' }
];

@NgModule({
  declarations : [
    EditComponent,
    ViewComponent,
    LatestComponent,
    SampleHomePage,
    SampleLoginPage,
    SampleRegisterPage,
    SamplePostPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    EditComponent,
    ViewComponent,
    LatestComponent

  ],
  providers : [ Member, Post, Data, Message, Philgo ]
})


export class PhilgoApiModule {}
