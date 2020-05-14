import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    public authService: AuthService,
    public navCtrl: NavController,
    private formBuilder: FormBuilder
    ) {
      this.loginForm = this.formBuilder.group({
        email: ['', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')])
        ],
        password: ['', Validators.required]
      });
    }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.loginForm.value);
  }

  signUp() {
    this.navCtrl.navigateForward('register');
  }

  return() {
    this.navCtrl.navigateBack('tabs/home');
  }
}
