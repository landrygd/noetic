import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerData = {
    name: '',
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
    this.navCtrl.navigateRoot('login');
  }

  signUp() {
    this.firebase.signUp(this.registerData);
  }

}
