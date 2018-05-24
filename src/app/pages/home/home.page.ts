import { Component } from '@angular/core';
import { ApiCurrencyResponse, PhilGoApiService } from '../../modules/philgo-api/providers/philgo-api.service';
import { PhilGoApiTestService } from '../../modules/philgo-api/providers/philgo-api-test.service';
@Component({
  selector: 'app-page-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [PhilGoApiTestService]
})
export class HomePage {
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
}

