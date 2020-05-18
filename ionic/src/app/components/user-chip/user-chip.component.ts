import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-user-chip',
  templateUrl: './user-chip.component.html',
  styleUrls: ['./user-chip.component.scss'],
})
export class UserChipComponent implements OnInit {

  @Input() userId: string;

  userObservable: Observable<unknown>;

  constructor(
    private userService: UserService,
    private navCtrl: NavController
    ) {}

  ngOnInit() {
    this.userObservable = this.userService.getUser(this.userId);
  }

  openProfile() {
    this.navCtrl.navigateForward('user/' + this.userId);
  }

}
