import { Injectable } from '@angular/core';
import { PopupService } from './popup.service';
import { TraductionService } from './traductionService.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';
import { AngularFirestoreDocument } from '@angular/fire/firestore/public_api';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase/app';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userId: string;
  auth: firebase.User;
  connected = false;
  lang = 'fr';
  userData: any;
  books: any;

  authState: Observable<any>;

  constructor(
    private firestore: AngularFirestore,
    private firestorage: AngularFireStorage,
    private fireauth: AngularFireAuth,
    private popupService: PopupService,
    private traductionService: TraductionService,
    private navCtrl: NavController,
    private userService: UserService
  ) {
    // Définir la langue courante
    this.lang = this.traductionService.getCurLanguage();
    // Vérification de la connexion
    this.fireauth.authState.subscribe(auth => {
      if (!auth) {
        this.connected = false;
      } else {
        this.connected = true;
        this.auth = auth;
        this.userId = auth.uid;
        this.userService.syncUserData(this.userId);
      }
    });
   }

  async deleteAccount() {
    const alert = await this.popupService.alertObj({
      header: 'Attention!',
      subHeader: 'Etes-vous sûr de supprimer votre compte?',
      message: 'En le supprimant tout vos livres seront également supprimés.',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Mot de passe'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'danger'
        }, {
          text: 'Supprimer ce compte',
          handler: (data) => {
            const credential = firebase.auth.EmailAuthProvider.credential(this.auth.email, data.password);
            this.auth.reauthenticateWithCredential(credential).then(() => this.deleteAccountProcess())
                                                              .catch((err) => this.popupService.alert('Mot de passe incorrect'));
          }
        }
      ]
    });
  }

  private async deleteAccountProcess() {
    this.popupService.loading('Suppression du compte...');

    // Supression des livres
    const books = [];
    // this.userData.book.forEach(bookId => {
    //   this.bookService.deleteBook(bookId);
    // });
    const userRef: AngularFirestoreDocument = this.firestore.collection('users').doc(this.userId);
    // Supression des sous-collections
    const subCollections = ['followers', 'follows'];
    subCollections.forEach((subCollection) => {
      userRef.collection(subCollection).get().subscribe((data) => {
        data.docs.forEach((doc) => userRef.collection(subCollection).doc(doc.id).delete());
      });
    });
    // Supression des images
    this.firestorage.ref('users/' + this.userId).delete();
    // Supression du document curUser
    userRef.delete();
    // Supression de l'utilisateur
    this.auth.delete();
    this.popupService.loadingDismiss();
  }

  async login(loginData) {
    this.popupService.loading('Connexion...');
    this.fireauth.signInWithEmailAndPassword(loginData.email, loginData.password)
    .then(auth => {
      this.popupService.loadingDismiss();
    })
    .catch(err => {
      this.popupService.loadingDismiss();
      this.popupService.toast('Email ou mot de passe incorrect');
    });
  }

  async signUp(registerData, mode = 'email') {
    this.popupService.loading('Inscription...');
    if (mode === 'email') {
      this.fireauth.createUserWithEmailAndPassword(registerData.email, registerData.password)
      .then(auth => {
        this.popupService.loadingDismiss();
        this.newUser(auth, registerData);
      })
      .catch(err => {
        this.popupService.loadingDismiss();
        this.popupService.toast('Email déjà utilisé');
      });
    }
    if (mode === 'google') {
      this.fireauth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then( auth => {
          this.popupService.loadingDismiss();
          this.newUser(auth);
        }
      );
    }
  }

  newUser(auth, registerData = {name: 'unknowed', birthday: 'unknowed'}) {
    const user = this.firestore.collection('/users').doc(auth.user.uid);
    user.set({
      id: auth.user.uid,
      name: registerData.name,
      nameLower: registerData.name.toLowerCase(),
      first: true,
      lang: this.traductionService.getCurLanguage(),
    });
    this.firestore.collection('/users').doc(auth.user.uid).collection('secured').doc('personnal').set({
      birthday: registerData.birthday,
    });
    this.firestore.collection('/users').doc(auth.user.uid).collection('secured').doc('credit').set({
      value: 0,
    });
  }

  logout() {
    this.userService.connected = false;
    this.userService.bookSub.unsubscribe();
    this.fireauth.signOut().then(() => this.navCtrl.navigateForward(['/login']));
  }
}
