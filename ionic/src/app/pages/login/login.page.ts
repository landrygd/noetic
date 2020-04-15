import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController, NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginData = {
    email: '',
    password: ''
  };

  constructor( 
    public firebase: FirebaseService,
    public navCtrl: NavController
    ) { }

  ngOnInit() {
  }

  login() {
    this.firebase.login(this.loginData);
  }

  signUp() {
    this.navCtrl.navigateRoot('register');
  }
}
