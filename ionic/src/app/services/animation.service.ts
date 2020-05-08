import { Injectable, ElementRef } from '@angular/core';
import { AnimationController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  constructor(
    public animationCtrl: AnimationController,
  ) { }

  fadeIn(elem: ElementRef, duration = 500) {
    const fadeIn = this.animationCtrl.create()
          .addElement(elem.nativeElement)
          .duration(duration)
          .fromTo('opacity', '0', '1');

    fadeIn.play();
  }
}
