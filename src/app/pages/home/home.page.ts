import { Component, ViewChild } from '@angular/core';
import { ApiCurrencyResponse, PhilGoApiService } from '../../modules/philgo-api/providers/philgo-api.service';
import { PhilGoApiTestService } from '../../modules/philgo-api/providers/philgo-api-test.service';
import { PostListComponent } from '../../modules/philgo-api/components/forum/post-list/post-list.component';
@Component({
  selector: 'app-page-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [PhilGoApiTestService]
})
export class HomePage {
  @ViewChild('postListComponent') postListComponent: PostListComponent = null;
  show = {
    page: ''
  };
  constructor(
    public api: PhilGoApiService
    // t: PhilGoApiTestService
  ) {
    // t.setUrl('https://local.philgo.com/api.php').run();
    // api.deleteFile(1).subscribe( res => console.log('res: ', res), e => console.log('ERROR: ', e));
  }
  onClickPostList( id ) {
    // this.show.page = 'post-list';
    // this.postId = 'freetalk';

    console.log( this.postListComponent );
    this.postListComponent.loadPage({ post_id: id });
  }
}

