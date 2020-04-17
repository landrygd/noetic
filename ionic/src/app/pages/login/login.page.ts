import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  private loginForm : FormGroup;

  constructor( 
    public firebase: FirebaseService,
    public navCtrl: NavController,
    private formBuilder: FormBuilder
    ) {
      this.loginForm = this.formBuilder.group({
        email: ['', Validators.compose([
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])
        ],
        password: ['', Validators.required]
      });
    }

  ngOnInit() {
  }

  login() {
    this.firebase.login(this.loginForm.value);
  }

  signUp() {
    this.navCtrl.navigateRoot('register');
  }
}
