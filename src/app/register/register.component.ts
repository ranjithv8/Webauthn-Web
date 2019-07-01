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
    this.publicKeyOptions.user.name = this.registerForm.get('username').value;
    this.publicKeyOptions.user.displayName = this.registerForm.get('firstname').value;
    this.publicKeyOptions.user.id = this.registerService.str2ab(this.publicKeyOptions.user.id);
    this.publicKeyOptions.challenge = this.registerService.str2ab(this.publicKeyOptions.challenge);
    delete this.publicKeyOptions.extensions;
    this.publicKeyOptions = {
      ...this.publicKeyOptions,
      authenticatorSelection:{
        authenticatorAttachment: "cross-platform",
        requireResidentKey: true,
        userVerification: "preferred"
      },
      timeout: 60000
    }
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
      .catch((err) => {
          console.log('ERROR', err);
      });
  }
}
