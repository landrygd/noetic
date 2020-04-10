import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NewChatComponent } from 'src/app/components/modals/new-chat/new-chat.component';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.page.html',
  styleUrls: ['./story.page.scss'],
})
export class StoryPage implements OnInit {

  constructor( private modalCtrl: ModalController, public firebase: FirebaseService) { }

  ngOnInit() {
  }

  async addChat() {
    const modal = await this.modalCtrl.create({
      component: NewChatComponent
    });
    return await modal.present();
  }

  openChat(chatId) {
    this.firebase.openChat(chatId);
  }

}
