import { GameService } from './../../../services/game.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-variables-viewer',
  templateUrl: './variables-viewer.component.html',
  styleUrls: ['./variables-viewer.component.scss'],
})
export class VariablesViewerComponent implements OnInit {

  constructor(public gameService: GameService) { }

  ngOnInit() {}

}
