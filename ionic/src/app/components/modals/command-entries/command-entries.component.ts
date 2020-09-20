import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AudioListComponent } from '../audio-list/audio-list.component';
import { WallpapersSearchComponent } from '../wallpapers-search/wallpapers-search.component';

@Component({
  selector: 'app-command-entries',
  templateUrl: './command-entries.component.html',
  styleUrls: ['./command-entries.component.scss'],
})
export class CommandEntriesComponent implements OnInit {

  @Input() name: string;
  @Input() inputs: {name: string, type: any}[];

  output: FormGroup;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit() {
    this.setupForm();
  }

  cancel() {
    this.modalController.dismiss();
  }

  setupForm() {
    const group = {};
    for (const input of this.inputs) {
      group[input.name] = ['', Validators.required];
    }
    this.output = this.formBuilder.group(group);
  }

  use() {
    this.modalController.dismiss(Object.values(this.output.value));
  }

  setValue(variable, value) {
    this.output[variable] = value;
  }

  isList(variable) {
    return typeof variable === 'object';
  }

  async audio(type = '') {
    const modal = await this.modalController.create({
    component: AudioListComponent,
    componentProps: {type}
    });
    await modal.present();
    const data = await modal.onDidDismiss();
    if (data.data) {
      this.output.patchValue({[type]: data.data});
    }
  }

  async background() {
    const modal = await this.modalController.create({
      component: WallpapersSearchComponent
    });
    await modal.present();
    const data = await modal.onDidDismiss();
    if (data.data) {
      const background = data.data.name;
      this.output.patchValue({background});
    }
   }
}
