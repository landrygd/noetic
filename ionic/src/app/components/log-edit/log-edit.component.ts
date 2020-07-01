import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-log-edit',
  templateUrl: './log-edit.component.html',
  styleUrls: ['./log-edit.component.scss'],
})
export class LogEditComponent implements OnInit {

  action: string;

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}

  setAction(actionName: string) {
    this.action = actionName;
    this.dismiss();
  }

  dismiss() {
    this.popoverController.dismiss({action: this.action});
  }
}
