import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  resetForm: FormGroup;

  constructor(
    public authService: AuthService,
    public navCtrl: NavController,
    private formBuilder: FormBuilder
    ) {
      this.resetForm = this.formBuilder.group({
        email: ['', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')])
        ],
      });
    }

  ngOnInit() {
  }

  reset() {
    this.authService.resetPassword(this.resetForm.value.email);
  }

  return() {
    this.navCtrl.navigateBack('login');
  }
}
