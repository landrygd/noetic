import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popover-audio-player',
  templateUrl: './popover-audio-player.component.html',
  styleUrls: ['./popover-audio-player.component.scss'],
})
export class PopoverAudioPlayerComponent implements OnInit {

  paused = false;

  constructor() { }

  ngOnInit() {}

}
