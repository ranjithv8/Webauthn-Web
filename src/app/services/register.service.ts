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
    return this.http.post(this.SERVER_CONTEXT + this.REGISTER_ENDPOINT, params);
  }
}
