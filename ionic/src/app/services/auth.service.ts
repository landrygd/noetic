import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { PopupService } from './popup.service';
import { TraductionService } from './traductionService.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController, Platform } from '@ionic/angular';
import { AngularFirestoreDocument } from '@angular/fire/firestore/public_api';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase/app';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  userId: string;
  auth: firebase.User;
  connected = false;
  lang = 'en';
  userData: any;
  books: any;

  authState: Observable<any>;

  AUTH: any;
  COMMON: any;
  authTradSub: Subscription;
  commonSub: Subscription;

  constructor(
    private firestore: AngularFirestore,
    private firestorage: AngularFireStorage,
    private fireauth: AngularFireAuth,
    private popupService: PopupService,
    private traductionService: TraductionService,
    private navCtrl: NavController,
    private userService: UserService,
    private router: Router,
    private gplus: GooglePlus,
    private plt: Platform,
    private facebook: Facebook,
    private translator: TranslateService
  ) {
    // Définir la langue courante
    this.lang = this.traductionService.getCurLanguage();
    // Vérification de la connexion
    this.fireauth.authState.subscribe(auth => {
      if (!auth) {
        this.connected = false;
        this.userService.syncDisconnectedCase();
      } else {
        this.connected = true;
        this.auth = auth;
        this.userId = auth.uid;
        this.userService.syncUserData(this.userId);
        if (this.router.url === '/login') {
          this.navCtrl.navigateBack('/');
        }
      }
    });
    this.getTraduction();
   }

  getTraduction() {
    this.authTradSub = this.translator.get('SERVICES.AUTH').subscribe((val) => {
      this.AUTH = val;
    });
    this.commonSub = this.translator.get('COMMON').subscribe((val) => {
      this.COMMON = val;
    });
  }

  ngOnDestroy() {
    this.authTradSub.unsubscribe();
    this.commonSub.unsubscribe();
  }

  // TODO?
  // async deleteAccount() {
  //   const alert = await this.popupService.alertObj({
  //     header: this.COMMON.warning,
  //     subHeader: 'Etes-vous sûr de supprimer votre compte?',
  //     message: 'En le supprimant tout vos livres seront également supprimés.',
  //     inputs: [
  //       {
  //         name: 'password',
  //         type: 'password',
  //         placeholder: 'Mot de passe'
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Annuler',
  //         role: 'cancel',
  //         cssClass: 'danger'
  //       }, {
  //         text: 'Supprimer ce compte',
  //         handler: (data) => {
  //           const credential = firebase.auth.EmailAuthProvider.credential(this.auth.email, data.password);
  //           this.auth.reauthenticateWithCredential(credential).then(() => this.deleteAccountProcess())
  //                                                             .catch((err) => this.popupService.error(err));
  //         }
  //       }
  //     ]
  //   });
  // }

  // private async deleteAccountProcess() {
  //   this.popupService.loading('Suppression du compte...');

  //   // Supression des livres
  //   const books = [];
  //   // this.userData.book.forEach(bookId => {
  //   //   this.bookService.deleteBook(bookId);
  //   // });
  //   const userRef: AngularFirestoreDocument = this.firestore.collection('users').doc(this.userId);
  //   // Supression des sous-collections
  //   const subCollections = ['followers', 'follows'];
  //   subCollections.forEach((subCollection) => {
  //     userRef.collection(subCollection).get().subscribe((data) => {
  //       data.docs.forEach((doc) => userRef.collection(subCollection).doc(doc.id).delete());
  //     });
  //   });
  //   // Supression des images
  //   this.firestorage.ref('users/' + this.userId).delete();
  //   // Supression du document curUser
  //   userRef.delete();
  //   // Supression de l'utilisateur
  //   this.auth.delete();
  //   this.popupService.loadingDismiss();
  // }

  async login(loginData) {
    this.popupService.loading('Connexion...');
    this.fireauth.signInWithEmailAndPassword(loginData.email, loginData.password)
    .then(auth => {
      this.popupService.loadingDismiss().catch((err) => this.popupService.error(err));
    })
    .catch(err => {
      this.popupService.loadingDismiss();
      this.popupService.toast('Email ou mot de passe incorrect');
    });
  }

  async signUp(registerData, mode = 'email') {
    if (mode === 'email') {
      this.fireauth.createUserWithEmailAndPassword(registerData.email, registerData.password)
      .then(auth => {
        this.newUser(auth, registerData);
      })
      .catch(err => {
        this.popupService.loadingDismiss();
        this.popupService.toast(this.AUTH.emailUsedError);
      });
    }
  }

  newUser(auth: firebase.auth.UserCredential, registerData = null) {
    const user = this.firestore.collection('/users').doc(auth.user.uid);
    if (registerData == null) {
      user.set({
        id: auth.user.uid,
        name: auth.user.displayName,
        nameLower: auth.user.displayName.toLowerCase(),
        first: true,
        lang: this.traductionService.getCurLanguage(),
        avatar: auth.user.photoURL
      });
    } else {
      user.set({
        id: auth.user.uid,
        name: registerData.name,
        nameLower: registerData.name.toLowerCase(),
        first: true,
        tuto: true,
        lang: this.traductionService.getCurLanguage(),
      });
    }
    // this.firestore.collection('/users').doc(auth.user.uid).collection('secured').doc('personnal').set({
    //   birthday: registerData.birthday,
    // });
    // this.firestore.collection('/users').doc(auth.user.uid).collection('secured').doc('credit').set({
    //   value: 0,
    // });
  }

  logout() {
    this.userService.logout();
  }

  resetPassword(email: string) {
    this.fireauth.sendPasswordResetEmail(email).then(() => this.navCtrl.navigateBack('login').then(
      () => this.popupService.alert(
        this.AUTH.resetPasswordLink + ' ' + email)
        ),
      ).catch((err) => this.popupService.error(err));
  }

  async nativeGoogleAuth(): Promise<void> {
    try {
      const gplusUser = await this.gplus.login({
        webClientId: '467577218262-0p5rdtm5e35re4ccoee76t5s4bvhiasn.apps.googleusercontent.com',
        offline: true,
        scopes: 'profile email'
      });

      this.fireauth.signInWithCredential(
        firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken)
      ).then(auth => this.authConnexion(auth));
    } catch (err) {
      this.popupService.error(err);
    }
  }

  async nativeFacebookAuth(): Promise<void> {
    try {
      const facebookUser = await this.facebook.login(['email']);

      this.fireauth.signInWithCredential(
        firebase.auth.GoogleAuthProvider.credential(facebookUser.authResponse.accessToken)
      ).then(auth => this.authConnexion(auth));
    } catch (err) {
      this.popupService.error(err);
    }
  }

  googleAuth() {
    if (this.plt.is('cordova')) {
      this.nativeGoogleAuth();
      return;
    }
    const provider = new firebase.auth.GoogleAuthProvider();
    this.fireauth.signInWithPopup(provider).then(auth => {
      this.authConnexion(auth);
    }).catch((err) => {
      this.popupService.error(err);
    });
  }

  facebookAuth() {
    if (this.plt.is('cordova')) {
      this.nativeFacebookAuth();
      return;
    }
    const provider = new firebase.auth.FacebookAuthProvider();
    this.fireauth.signInWithPopup(provider).then(auth => {
      this.authConnexion(auth);
    }).catch((err) => {
      this.popupService.error(err);
    });
  }

  authConnexion(auth: firebase.auth.UserCredential) {
    const user = this.firestore.doc(`users/${auth.user.uid}`).get();
    user.subscribe(data => {
      if (!data.exists) {
        this.newUser(auth);
      }
    });
  }

  async changeEmail(email: string) {
    const alert = await this.popupService.alertObj({
      message: this.AUTH.confirmPasswordWarning,
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: this.AUTH.password,
        }
      ],
      buttons: [
        {
          text: this.COMMON.cancel,
          role: 'cancel'
        }, {
          text: this.COMMON.confirm,
          handler: (data) => {
            const oldEmail = this.auth.email;
            const credential = firebase.auth.EmailAuthProvider.credential(oldEmail, data.password);
            this.auth.reauthenticateWithCredential(credential).then(() => {
              this.auth.updateEmail(email).then(
                () => this.popupService.alert(
                  this.AUTH.confirmNewMail + ' ' +
                  this.auth.email
                  )
                ).catch((err) => this.popupService.error(err));
            }).catch((err) => this.popupService.alert(this.AUTH.passwordError));
          }
        }
      ]
    });
  }

  async changePassword() {
    const alert = await this.popupService.alertObj({
      message: this.AUTH.confirmPasswordWarning,
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: this.AUTH.password,
        }
      ],
      buttons: [
        {
          text: this.COMMON.cancel,
          role: 'cancel'
        }, {
          text: this.COMMON.confirm,
          handler: (data) => {
            const oldEmail = this.auth.email;
            const credential = firebase.auth.EmailAuthProvider.credential(oldEmail, data.password);
            this.auth.reauthenticateWithCredential(credential).then(() => {
              this.fireauth.sendPasswordResetEmail(oldEmail).then(() => this.navCtrl.navigateBack('login').then(
                () => this.popupService.alert(
                  this.AUTH.resetPasswordLink + ' ' + oldEmail)
                  ),
                ).catch((err) => this.popupService.error(err));
            }).catch((err) => this.popupService.alert(this.AUTH.passwordError));
          }
        }
      ]
    });
  }
}
