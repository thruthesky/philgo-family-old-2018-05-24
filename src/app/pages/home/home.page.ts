import { Component } from '@angular/core';
import { ApiCurrencyResponse } from '../../modules/philgo-api/providers/philgo-api.service';
import { PhilGoApiTestService } from '../../modules/philgo-api/providers/philgo-api-test.service';
@Component({
  selector: 'app-page-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [PhilGoApiTestService]
})
export class HomePage {
  constructor(
    t: PhilGoApiTestService
  ) {
    t.setUrl('https://local.philgo.com/api.php').run();
  }
}
