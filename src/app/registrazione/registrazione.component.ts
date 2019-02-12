import { Component, HostBinding } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import {Inject} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material";
import {MatSnackBar} from '@angular/material';
import { FormGroup, FormControl,  FormGroupDirective, NgForm, Validators,  FormBuilder } from '@angular/forms'; 
import {ErrorStateMatcher} from '@angular/material/core';

export interface FormModel {
  captcha?: string;

}


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.component.html',
  styleUrls: ['./registrazione.component.css']
})



export class RegistrazioneComponent {


  public formModel: FormModel = {};

  state: string = '';
  error: any;
  authState: any = null;
  recaptcha: string = ''
  messagge : string = ''
  messaggioCampi : string = ''




  registrationForm: FormGroup; 
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  nome = new FormControl('', [Validators.required]);

  constructor(private fb: FormBuilder, public db: AngularFireDatabase, public snackBar: MatSnackBar, public af: AngularFireAuth,private router: Router, public as:AuthenticationService) {


    this.registrationForm = this.fb.group({
      email:this.email,
      password:this.password,
      nome:this.nome,
    });
  }

  getMailErrorMessage() {
    return this.email.hasError('required') ? 'Enter the value' :
        this.email.hasError('email') ? 'It is not a valid email address' :
            '';
  }

  getPasswordErrorMessage() {
    return this.password.hasError('required') ? 'Please enter your password' :
            '';
  }

  getNomeErrorMessage() {
    return this.nome.hasError('required') ? 'Please enter your name' :
            '';
  }

  onSubmit(formData) {
    if (this.recaptcha !=''){

        this.messagge = 'Check OK'
        if(formData.valid){

              let email = formData.value.email
              let password =  formData.value.password
              let nome = formData.value.nome
              this.af.auth.createUserWithEmailAndPassword(email, password).then((user) => {


                this.af.auth.signInWithEmailAndPassword(email, password).then(() => {

                  this.router.navigate(['/']); 
                });

              }).catch((_error) => {
                    let errors = '';
                    if( _error.code === 'auth/weak-password') errors += 'The password must have at least 6 characters.';
                    if( _error.code === 'auth/email-already-in-use') errors += 'This email has already been used.';

                        this.snackBar.open(errors, '', {
                        duration: 3000,
                      }); 
              })
        } 
    } else {

      this.messagge = 'Please check'
    }
  }

  resolved(captchaResponse: string) {

        this.messagge = 'Check OK'
        this.recaptcha =  captchaResponse

  }


}
