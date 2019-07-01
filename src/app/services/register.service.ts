import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  SERVER_CONTEXT = '/api';
  CHALLENGE_ENDPOINT = '/get-challenge';
  REGISTER_ENDPOINT = '/register';
;
  constructor(
    private http: HttpClient
  ) {
  }

  getChallenge () {
    return this.http.get(this.SERVER_CONTEXT + this.CHALLENGE_ENDPOINT);
  }

  register (params) {
    return this.http.post(params, this.SERVER_CONTEXT + this.REGISTER_ENDPOINT);
  }

  str2ab(str) {
    debugger;
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
}
