import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegisterService } from '../services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  devLog: [any] = [null];
  publicKeyOptions: any;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      'firstname': ['', [Validators.required]],
      'username': ['', [Validators.email, Validators.required]]
    });
    this.registerService.getChallenge().subscribe((publicKeyOptions) => {
      this.devLog.push(JSON.stringify(publicKeyOptions));
      this.changeDetectorRef.markForCheck();
      this.publicKeyOptions = publicKeyOptions;
    });
  }

  onSubmit() {
    const encoder = new TextEncoder();
    this.publicKeyOptions.user.name = this.registerForm.get('username').value;
    this.publicKeyOptions.user.displayName = this.registerForm.get('firstname').value;
    this.publicKeyOptions.user.id = encoder.encode(this.publicKeyOptions.user.id);
    this.publicKeyOptions.challenge = encoder.encode(this.publicKeyOptions.challenge);
    this.publicKeyOptions.pubKeyCredParams.length = 1;
    this.publicKeyOptions.rp.id = 'webauthn-signin.herokuapp.com';
    this.publicKeyOptions = {
      ...this.publicKeyOptions
    };
    const createCredentialDefaultArgs = {
      publicKey: this.publicKeyOptions
    };
    this.devLog.push(JSON.stringify(createCredentialDefaultArgs));

    const nav: any = navigator;
    nav.credentials.create(createCredentialDefaultArgs)
      .then((creds) => {
        this.devLog.push(JSON.stringify(creds));
        this.changeDetectorRef.markForCheck();
        this.registerService.register(creds);
      })
      .catch((err,thenga) => {
          this.devLog.push(err.message);
          this.changeDetectorRef.markForCheck();
          console.log('ERROR', err);
      });
  }
}
