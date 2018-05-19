import { Component } from '@angular/core';
import { PhilGoApiService, ApiCurrencyResponse } from '../../modules/philgo-api/providers/philgo-api.service';

@Component({
  selector: 'app-page-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  constructor(
    public api: PhilGoApiService
  ) {
    api.setUrl( 'https://local.philgo.com/api.php' );
    api.version().subscribe( re => {
      console.log('version: ', re.version);
    }, e => console.log(`Error code: ${e.code}, message: ${e.message}`));
    api.exchangeRate().subscribe( re => {
      console.log('exchangeRate: ', re);
    }, e => console.log(`Error code: ${e.code}, message: ${e.message}`));

    api.query<ApiCurrencyResponse>('exchangeRate', {currency: 'php'}).subscribe( re => {
      console.log('usd: ', re.usd);
      console.log('php: ', re.php);
    }, e => console.log(e));
  }
}
