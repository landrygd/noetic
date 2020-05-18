import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, ToastController, IonInput, IonDatetime } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  confirmPassword = '';
  registerForm: FormGroup;
  privacy = false;

  @ViewChild('date', { static: true }) dateView: IonDatetime;
  @ViewChild('email', { static: true }) emailView: IonInput;
  @ViewChild('password', { static: true }) passwordView: IonInput;
  @ViewChild('confirmPassword', { static: true }) confirmPasswordView: IonInput;

  constructor(
    public authService: AuthService,
    public navCtrl: NavController,
    private toastController: ToastController,
    private formBuilder: FormBuilder
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: new FormControl( '', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')
      ]),
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
   }

  next(name) {
    if (name === 'date') {
      this.dateView.open();
    }
    if (name === 'email') {
      setTimeout(() => this.emailView.setFocus(), 500);
    }
    if (name === 'password') {
      this.passwordView.setFocus();
    }
    if (name === 'confirmPassword') {
      this.confirmPasswordView.setFocus();
    }
    if (name === 'confirm') {
      this.signUp();
    }
  }

  ngOnInit() {
  }

  showPrivacy() {
    this.navCtrl.navigateForward('privacy');
  }

  login() {
    this.navCtrl.navigateBack('login');
  }

  async toast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }

  signUp() {
    const res = this.registerForm.value;
    let error = '';
    if (res.password !== res.confirmPassword) {
      error = 'Les mots de passe ne se correspondent pas.';
    }
    if (!this.allLetterOrNumber(res.name)) {
      error = 'Le pseudo ne contenir que des chiffres et des lettres.';
    }
    // if (new Date(Date.now() - new Date(res.birthday).getTime()).getFullYear() - 1970 < 12) {
    //   error = 'L\'âge minimum requis est de 12 ans';
    // }
    if (res.password.length < 8) {
      error = 'Le mot de passe doit contenir au moins 8 caractères.';
    }
    if (res.password.length > 30) {
      error = 'Le mot de passe ne doit contenir pas contenir plus de 30 caractères.';
    }
    if (res.name.length < 4) {
      error = 'Le pseudo doit contenir au moins 4 caractères.';
    }
    if (res.name.length > 30) {
      error = 'Le pseudo ne doit contenir pas contenir plus de 30 caractères.';
    }
    if (!this.privacy) {
      error = 'Vous devez accepter la politique de confidentialité pour vous inscrire.';
    }
    // if (error === '') {
    //   this.authService.signUp(res);
    // } else {
    //   this.toast(error);
    // }
    this.toast(error);
  }

  allLetterOrNumber(str: string): boolean {
    if (/^[A-zÀ-ú0-9]+$/.test(str)) {
      return true;
      } else {
      return false;
    }
  }
}
