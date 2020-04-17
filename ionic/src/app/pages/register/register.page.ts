import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavController, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TraductionService } from 'src/app/services/traductionService.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  confirmPassword = '';
  private registerForm : FormGroup;

  constructor(
    public firebase: FirebaseService,
    public navCtrl: NavController,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private translator: TraductionService
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])
      ],
      password: ['', Validators.required],
      birthday: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
   }

  ngOnInit() {
  }

  login() {
    this.navCtrl.navigateRoot('login');
  }

  async toast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }

  signUp() {
    const res = this.registerForm.value
    if(res.password == res.confirmPassword) {
      if(this.allLetterOrNumber(res.name)) {
        if(res.password.length >= 8) {
          this.firebase.signUp(res);
        } else {
          this.toast('Le mot de passe doit contenir au moins 8 caractères.');
        }
      } else {
        this.toast('Le pseudo ne contenir que des chiffres et des lettres.');
      }
    } else {
      this.toast('Les mots de passe ne se correspondent pas.');
    }
  }

  allLetterOrNumber(string): boolean { 
    if(/^[A-zÀ-ú0-9]+$/.test(string)) {
      return true;
      } else {
      return false;
    }
  }
}
