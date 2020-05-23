import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-chip-audio',
  templateUrl: './chip-audio.component.html',
  styleUrls: ['./chip-audio.component.scss'],
})
export class ChipAudioComponent implements OnInit {

  @Input() type: string;
  @Input() name: string;
  @Output() play = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {}

  playAudio() {
    this.play.emit();
  }
}
