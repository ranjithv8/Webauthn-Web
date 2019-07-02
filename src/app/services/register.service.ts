import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  SERVER_CONTEXT = '/api';
  CHALLENGE_ENDPOINT = '/get-challenge';
  REGISTER_ENDPOINT = '/register';
  lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  constructor(
    private http: HttpClient
  ) {
  }

  getChallenge () {
    return this.http.get(this.SERVER_CONTEXT + this.CHALLENGE_ENDPOINT);
  }

  register (params) {
    try {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      };
      return this.http.post(this.SERVER_CONTEXT + this.REGISTER_ENDPOINT, params);
    } catch (e) {
      alert(e.message);
    }
  }

  uint8ToBase64 (uint8) {
    let i
    let extraBytes = uint8.length % 3 // if we have 1 byte left, pad 2 bytes
    let output = ''
    let temp, length

    // go through the array every three bytes, we'll deal with trailing stuff later
    for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
      temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
      output += this.tripletToBase64(temp);
    }

    // pad the end with zeros, but make sure to not forget the extra bytes
    switch (extraBytes) {
      case 1:
        temp = uint8[uint8.length - 1];
        output += this.encode(temp >> 2);
        output += this.encode((temp << 4) & 0x3F);
        output += '==';
        break;
      case 2:
        temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
        output += this.encode(temp >> 10);
        output += this.encode((temp >> 4) & 0x3F);
        output += this.encode((temp << 2) & 0x3F);
        output += '=';
        break;
      default:
        break;
    }
    console.log('output:' , output);
    return output;
  }

  encode (num) {
    return this.lookup.charAt(num)
  }

  tripletToBase64 (num) {
    return this.encode(num >> 18 & 0x3F) + this.encode(num >> 12 & 0x3F) + this.encode(num >> 6 & 0x3F) + this.encode(num & 0x3F)
  }

  bufferEncode(value) {
   return this.uint8ToBase64(value)
       .replace(/\+/g, '-')
       .replace(/\//g, '_')
       .replace(/=/g, '');
  }
}
