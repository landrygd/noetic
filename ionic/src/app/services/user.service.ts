import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore/public_api';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: Observable<unknown>;
  userId: string;
  ownUserId: string;
  ownUser: Observable<unknown>;
  ownProfile: boolean;

  usersCollection: AngularFirestoreCollection<any>;

  constructor(
    private firebase: FirebaseService,
    private navCtrl: NavController,
    private firestore: AngularFirestore,
    ) {
      this.init();
    }

  async init() {
    this.ownUserId = this.firebase.userId;
    this.usersCollection = this.firestore.collection('users');
  }

  getOwnUser() {
    this.ownUserId = this.firebase.userId;
    this.ownUser = this.getUser(this.ownUserId);
    return this.ownUser;
  }
  setUser(userId: string = this.firebase.userId): void {
    this.userId = userId;
    this.ownProfile = this.userId === this.ownUserId;
    if (this.userId === this.firebase.userId) {
      this.user = this.ownUser;
    } else {
      this.user = this.getUser(userId);
    }
  }

  getUser(userId: string): Observable<unknown> {
    return this.usersCollection.doc(userId).valueChanges();
  }

  openUser(userId: string) {
    if (userId  !== this.firebase.userId) {
      this.setUser(userId);
      this.navCtrl.navigateForward('profile');

    } else {
      this.firebase.toast('c\'est votre propre profil!');
    }
  }

  updateUserData(data, userId: string = this.ownUserId) {
    this.usersCollection.doc(userId).update(data);
  }

  followUser(userId: string = this.userId) {
    this.usersCollection.doc(this.ownUserId).collection('follows').doc(userId).set({});
    this.usersCollection.doc(userId).collection('followers').doc(this.ownUserId).set({});
  }

  unfollowUser(userId: string = this.userId) {
    this.usersCollection.doc(this.ownUserId).collection('follows').doc(userId).delete();
    this.usersCollection.doc(userId).collection('followers').doc(this.ownUserId).delete();
  }

  getFollows(userId: string = this.userId): Observable<any> {
    return this.usersCollection.doc(userId).collection('follows').get();
  }

  getFollowers(userId: string = this.userId): Observable<any> {
    return this.usersCollection.doc(userId).collection('followers').get();
  }

  isFollow(userId: string): Promise<boolean> {
    return new Promise(resolve => {
      this.usersCollection.doc(this.ownUserId).collection('follows').get().subscribe((data) => {
        data.forEach((doc) => {
          if (doc.id === userId) {
            resolve(true);
          }
        });
        resolve(false);
      }).unsubscribe();
    });
  }
}
