import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-variables-viewer',
  templateUrl: './variables-viewer.component.html',
  styleUrls: ['./variables-viewer.component.scss'],
})
export class VariablesViewerComponent implements OnInit {

  @Input() variables: any = {};

  globalVariables: {name: string, value: string}[] = [];
  roles: string[];

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    Object.keys(this.variables).forEach((key) => {
      if (this.isGlobalVariable(key)) {
        this.globalVariables.push({
          name: key,
          value: this.variables[key]
        });
      } else if (this.isRoleVariable(key)) {
        this.roles.push(key);
      }
    });
    console.log('----Variables----');
    console.log(this.variables);
    console.log(this.globalVariables);
    console.log(this.roles);
  }

  isGlobalVariable(key: string): boolean {
    return key.charAt(0) === '$' ? true : false;
  }

  isRoleVariable(key: string): boolean {
    return key.charAt(0) === '@' ? true : false;
  }

  cancel() {
    this.modalController.dismiss();
  }

}
