import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ModalController, ActionSheetController, AlertController, NavController } from '@ionic/angular';
import { UploadComponent } from 'src/app/components/modals/upload/upload.component';
import { UserService } from 'src/app/services/user.service';
import { BookService } from 'src/app/services/book.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { SlidesService } from 'src/app/services/slides.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  userAsync: Observable<any>;
  user: any;
  userSub: Subscription;
  loading: boolean;
  ownProfile = false;
  followed = false;
  followSub: Subscription;
  userBooks: Observable<any>[];

  constructor(
    public firebase: FirebaseService,
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    private alertController: AlertController,
    public navCtrl: NavController,
    public userService: UserService,
    public bookService: BookService,
    public router: Router,
    public slides: SlidesService
    ) {
    this.loading = true;
    if (router.url === '/tabs/profile') {
      this.userAsync = userService.getOwnUser();
    } else {
      this.userAsync = userService.user;
    }
    this.userSub = this.userAsync.subscribe((val) => {
      this.user = val;
      this.ownProfile = this.user.id === this.userService.ownUserId;
      this.userBooks = this.user.book;
      if (!this.followSub) {
        this.followSub = this.userService.usersCollection.doc(this.userService.ownUserId)
        .collection('follows').snapshotChanges().subscribe((data) => {
          this.followed = false;
          data.forEach((doc) => {
            const id = doc.payload.doc.id;
            if (id === this.user.id) {
              this.followed = true;
            }
          });
        });
      }
      this.loading = false;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.followSub.unsubscribe();
    this.userSub.unsubscribe();
  }

  async changeAvatar() {
    const modal = await this.modalController.create({
      component: UploadComponent,
      componentProps: {
        type: 'userAvatar'
      }
    });
    return await modal.present();
  }

  async options() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Se déconnecter',
        icon: 'exit',
        handler: () => {
          this.firebase.logout();
        }
      }, {
        text: 'Annuler',
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  async changeUsername() {
    const alert = await this.alertController.create({
      header: 'Changer de pseudo',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Votre pseudo',
          value: this.firebase.userData.name,
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: (data) => {
            this.userService.updateUserData({name: data.name});
          }
        }
      ]
    });
    await alert.present();
  }

  async changeBio() {
    const alert = await this.alertController.create({
      header: 'Changer de bio',
      inputs: [
        {
          name: 'bio',
          type: 'text',
          placeholder: 'Votre bio',
          value: this.firebase.userData.bio,
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: (data) => {
            this.userService.updateUserData({bio: data.bio});
          }
        }
      ]
    });
    await alert.present();
  }

  notif() {
    this.navCtrl.navigateForward('notifs');
  }

  onClick() {}

  follow() {
    this.userService.followUser();
  }

  unfollow() {
    this.userService.unfollowUser();
  }
}
