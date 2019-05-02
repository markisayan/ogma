import { Pipe, PipeTransform } from '@angular/core';
import {GlobalSettingsService} from './global-settings.service';

@Pipe({
  name: 'country',
})
export class CountryPipe implements PipeTransform {

  constructor(public globalSettings: GlobalSettingsService) { }
  transform(value: any, args?: any): any {
    return this.globalSettings.countryCodes[value] || '';
  }
}
