import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-tuto-popover',
  templateUrl: './tuto-popover.component.html',
  styleUrls: ['./tuto-popover.component.scss'],
})
export class TutoPopoverComponent implements OnInit {

  @Input() info: string;
  @Input() end: boolean;

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}

  cancel() {
    this.popoverController.dismiss({cancel: true});
  }

  next() {
    this.popoverController.dismiss({});
  }

}
