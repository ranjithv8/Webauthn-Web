import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      'firstname': ['', [Validators.required]],
      'username': ['', [Validators.email, Validators.required]]
    });
  }

  onSubmit() {
    const createCredentialDefaultArgs = {
      publicKey: {
          rp: {
              name: 'Acme'
          },
          user: {
              id: new Uint8Array(16),
              name: this.registerForm.get('username').value,
              displayName: this.registerForm.get('firstname').value
          },
          pubKeyCredParams: [{
              type: 'public-key',
              alg: -7
          }],
          attestation: 'direct',
          timeout: 60000,
          challenge: new Uint8Array([ 
              0x8C, 0x0A, 0x26, 0xFF, 0x22, 0x91, 0xC1, 0xE9, 0xB9, 0x4E, 0x2E, 0x17, 0x1A, 0x98, 0x6A, 0x73,
              0x71, 0x9D, 0x43, 0x48, 0xD5, 0xA7, 0x6A, 0x15, 0x7E, 0x38, 0x94, 0x52, 0x77, 0x97, 0x0F, 0xEF
          ]).buffer
      }
    };

    const nav: any = navigator;
    nav.credentials.create(createCredentialDefaultArgs)
      .then((cred) => {
        console.log(cred);
      })
      .catch((err) => {
          console.log('ERROR', err);
      });
  }
}
