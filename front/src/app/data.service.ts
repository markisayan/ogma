/*
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Injectable} from '@angular/core';
import {Response, Headers} from '@angular/http';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class DataService<Type> {
  private resolveSuffix = '?filter={"include":"resolve"}';
  private actionUrl: string;
  private headers: Headers;

  constructor(private http: HttpClient) {
    this.actionUrl = '/api/';
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  public getAll(ns: string, filter?: object) {
    const whereCommand: {where?: object, include?: string} = {include: 'resolve'};
    if (filter) {
      whereCommand.where = filter;
    }
    const filterCommand = '?filter=' + JSON.stringify(whereCommand).replace(/#/g, '%23');
    return this.http.get(`${this.actionUrl}${ns}${filterCommand}`);
  }

  public getSingle(ns: string, id: string) {
    return this.http.get(this.actionUrl + ns + '/' + id + this.resolveSuffix);
  }

  public add(ns: string, asset: Type) {
    return this.http.post(this.actionUrl + ns + this.resolveSuffix, asset);
  }

  public update(ns: string, id: string, itemToUpdate: Type) {
    return this.http.put(`${this.actionUrl}${ns}/${id}`, itemToUpdate);
  }

  public delete(ns: string, id: string) {
    return this.http.delete(this.actionUrl + ns + '/' + id);
  }
}
