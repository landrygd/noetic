import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform, NavController, ModalController } from '@ionic/angular';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { PopupService } from './popup.service';

export enum ConnectionStatus {
  Online,
  Offline
}

@Injectable({
  providedIn: 'root'
})

export class NetworkService {

  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);
  private modal: HTMLIonModalElement;

  isOnline = true;

  constructor(
    private plt: Platform,
    private network: Network,
    private navCtrl: NavController,
    private modalController: ModalController,
    private popupService: PopupService
    ) {
    this.plt.ready().then((p) => {
      this.initializeNetwork();
    });
  }

  initializeNetwork() {
    if (this.plt.is('cordova')) {
      const status = this.network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
      this.status.next(status);
      if (this.status.getValue() === ConnectionStatus.Offline) {
        this.offline();
      }
      const disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        if (this.status.getValue() === ConnectionStatus.Online) {
          this.offline();
        }
      });
      const connectSubscription = this.network.onConnect().subscribe(() => {
        if (this.status.getValue() === ConnectionStatus.Offline) {
          this.online();
        }
      });
    } else {
      const status = navigator.onLine ? ConnectionStatus.Online : ConnectionStatus.Offline;
      this.status.next(status);
      fromEvent(window, 'offline').subscribe(() => {
        this.updateOnlineStatus();
      });
      fromEvent(window, 'online').subscribe(() => {
        this.updateOnlineStatus();
      });
    }
  }

  updateNetworkStatus(status: ConnectionStatus) {
    this.status.next(status);
    const connection = status === ConnectionStatus.Offline ? 'connecté' : 'déconnecté';
    this.popupService.toast('Vous êtes ' + connection);
  }

  async offline() {
    this.isOnline = false;
    this.updateNetworkStatus(ConnectionStatus.Offline);
    this.navCtrl.navigateForward('offline');
  }

  async online() {
    if (this.modal) {
      await this.modal.dismiss();
      this.modal = undefined;
      this.isOnline = true;
      this.updateNetworkStatus(ConnectionStatus.Online);
      this.navCtrl.back();
    }
  }

  updateOnlineStatus() {
    const condition = navigator.onLine ? 'online' : 'offline';
    if (condition === 'online') {
      this.online();
    } else {
      this.offline();
    }
  }
}
