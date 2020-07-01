import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NavController, ToastController, IonInput, IonDatetime } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {

  confirmPassword = '';
  registerForm: FormGroup;
  privacy = false;

  registerSub: Subscription;
  commonSub: Subscription;

  REGISTER: any;
  COMMON: any;

  @ViewChild('date', { static: true }) dateView: IonDatetime;
  @ViewChild('email', { static: true }) emailView: IonInput;
  @ViewChild('password', { static: true }) passwordView: IonInput;
  @ViewChild('confirmPassword', { static: true }) confirmPasswordView: IonInput;

  constructor(
    public authService: AuthService,
    public navCtrl: NavController,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private translator: TranslateService
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
    this.getTraduction();
  }

  getTraduction() {
    this.registerSub = this.translator.get('REGISTER').subscribe((val) => {
      this.REGISTER = val;
    });
    this.commonSub = this.translator.get('COMMON').subscribe((val) => {
      this.COMMON = val;
    });
  }

  ngOnDestroy() {
    this.registerSub.unsubscribe();
    this.commonSub.unsubscribe();
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
    res.name = res.name.trim();
    res.email = res.email.trim();
    let error = '';
    if (res.password !== res.confirmPassword) {
      error = this.REGISTER.paswordMatchError;
    }
    if (!this.allLetterOrNumber(res.name)) {
      error = this.REGISTER.pseudoInvalidCarError;
    }
    if (res.password.length < 8) {
      error = this.REGISTER.paswordMinError;
    }
    if (res.password.length > 30) {
      error = this.REGISTER.passwordMaxError;
    }
    if (res.name.length < 4) {
      error = this.REGISTER.pseudoMinError;
    }
    if (res.name.length > 30) {
      error = this.REGISTER.pseudoMaxError;
    }
    if (!this.privacy) {
      error = this.REGISTER.policyError;
    }
    if (error === '') {
      this.authService.signUp(res);
    } else {
      this.toast(error);
    }
  }

  allLetterOrNumber(str: string): boolean {
    if (/^[A-zÀ-ú0-9]+$/.test(str)) {
      return true;
      } else {
      return false;
    }
  }
}
