import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, ActionSheetController, AlertController, NavController } from '@ionic/angular';
import { UploadComponent } from 'src/app/components/modals/upload/upload.component';
import { UserService } from 'src/app/services/user.service';
import { BookService } from 'src/app/services/book.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { SlidesService } from 'src/app/services/slides.service';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Book } from 'src/app/classes/book';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  userAsync: Observable<any>;
  user: any;
  userSub: Subscription;
  loading = true;
  ownProfile = false;
  followed = false;
  followSub: Subscription;
  books: any[] = [];
  userId: string;
  tabs = false;

  banner = 'url("../../../assets/banner.png")';

  profileSub: Subscription;
  commonSub: Subscription;
  PROFILE: any;
  COMMON: any;

  constructor(
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    private alertController: AlertController,
    public navCtrl: NavController,
    public userService: UserService,
    public bookService: BookService,
    public router: Router,
    public slides: SlidesService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private translator: TranslateService
    ) {}

  ngOnInit() {
    this.getTraduction();
  }

  admin() {
    this.navCtrl.navigateForward('admin');
  }

  getTraduction() {
    this.profileSub = this.translator.get('PROFILE').subscribe((val) => {
      this.PROFILE = val;
    });
    this.commonSub = this.translator.get('COMMON').subscribe((val) => {
      this.COMMON = val;
    });
  }

  ngOnDestroy() {
    this.profileSub.unsubscribe();
    this.commonSub.unsubscribe();
    if (this.followSub) {
      this.followSub.unsubscribe();
      this.userSub.unsubscribe();
    }
  }

  async ionViewDidEnter() {
    if (this.router.url.charAt(1) === 't') {
      this.tabs = true;
    }
    this.loading = true;
    const userId = this.route.snapshot.paramMap.get('id');
    // Utilisateur courant
    if (userId === this.userService.userId || userId == null) {
      this.userId = this.userService.userId;
      if (this.userService.connected) {
        // Utilisateur connecté
        if (this.userAsync !== this.userService.user) {
          // Utilisateur pas encare chargé
          this.userAsync = this.userService.user;
          this.syncData();
        } else {
          this.loading = false;
        }
      } else {
        // Utilisateur non connecté
        this.navCtrl.navigateRoot('/');
      }
    } else {
      // Utilisateur différent
      this.userId = userId;
      if (this.userService.curUserId === userId) {
        // Utilisateur déjà chargé
        if (this.userAsync !== this.userService.curUser) {
          this.userAsync = this.userService.curUser;
          this.syncData();
        }
      } else {
        // Utilisateur pas encore chargé
        await this.userService.openUser(userId).then(() => {
          this.userAsync = this.userService.curUser;
          this.syncData();
        }).catch(() => {
          this.navCtrl.navigateRoot('/');
      });
      }
    }
  }

  syncData() {
    this.userSub = this.userAsync.subscribe((val) => {
      this.user = val;
      this.getBanner();
      this.ownProfile = this.user.id === this.userService.userId;
      // this.userBooks = this.userService.getBooks();
      if (!this.followSub && this.userService.connected) {
        this.followSub = this.userService.usersCollection.doc(this.userId)
        .collection('followers').snapshotChanges().subscribe((data) => {
          this.followed = false;
          data.forEach((doc) => {
            const id = doc.payload.doc.id;
            if (id === this.userService.userId) {
              this.followed = true;
            }
          });
        });
      }
      this.loading = false;
    });
  }

  async changeAvatar(userId) {
    if (userId === this.userService.userId) {
      const modal = await this.modalController.create({
        component: UploadComponent,
        componentProps: {
          type: 'userAvatar'
        }
      });
      return await modal.present();
    }
  }

  async options() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: this.PROFILE.share,
          icon: 'share-social',
          handler: () => {
            actionSheet.dismiss().then(() => this.share());
          }
        },
        {
          text: this.COMMON.settings,
          icon: 'settings',
          handler: () => {
            this.navCtrl.navigateForward('user-settings');
          }
        },
        {
        text: this.PROFILE.disconnect,
        icon: 'exit',
        handler: () => {
          this.authService.logout();
        }
        }, {
        text: this.COMMON.cancel,
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  async changeUsername() {
    const alert = await this.alertController.create({
      header: this.PROFILE.changePseudo,
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: this.PROFILE.newPseudo,
          value: this.userService.userData.name,
        }
      ],
      buttons: [
        {
          text: this.COMMON.cancel,
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.COMMON.ok,
          handler: (data) => {
            this.userService.updateUserData({name: data.name});
          }
        }
      ]
    });
    await alert.present();
  }

  async changeBio() {
    let bio = '';
    if (this.userService.userData.bio) {
      bio = this.userService.userData.bio;
    }
    const alert = await this.alertController.create({
      header: this.PROFILE.changeBio,
      inputs: [
        {
          name: 'bio',
          type: 'text',
          placeholder: this.PROFILE.newBio,
          value: bio,
        }
      ],
      buttons: [
        {
          text: this.COMMON.cancel,
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
    this.userService.followUser(this.userId);
  }

  unfollow() {
    this.userService.unfollowUser();
  }

  back() {
    this.userService.curUserBooksSub.unsubscribe();
  }

  share() {
    this.userService.shareUser(this.userId);
  }

  async changeBanner() {
    if (this.ownProfile && this.tabs) {
      const modal = await this.modalController.create({
        component: UploadComponent,
        componentProps: {
          type: 'banner',
        }
      });
      modal.onDidDismiss()
        .then(async (data) => {
          if (data.data) {
            await this.userService.uploadBanner(data.data);
            this.getBanner();
          }
      });
      return await modal.present();
    }
  }

  getBanner() {
    const banner = this.user.banner;
    if (banner) {
      const res = 'url(' + banner + ')';
      this.banner = res;
    }
  }

  report() {
    this.userService.report('user', this.userId);
  }
}
