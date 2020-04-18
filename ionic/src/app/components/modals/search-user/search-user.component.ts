import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss'],
})
export class SearchUserComponent implements OnInit {

  userId:string = "";

  users: any[] = [];

  constructor(private modalCtrl: ModalController, public firebase: FirebaseService) { }

  ngOnInit() {}

  cancel() {
    this.dismiss();
  }

  confirm(userId) {
    this.userId = userId;
    this.dismiss();
  }

  dismiss() {
    this.modalCtrl.dismiss({
      userId: this.userId
    });
  }

  onSearchChange(text) {
    this.users = [];
    this.firebase.getUsersByName(text).subscribe((value)=>{
      value.docs.forEach(user => {
        if(user.id !== this.firebase.userId) {
          this.users.push(user.data());
        }
      });
    });
  }
}
