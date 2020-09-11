import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-variables-viewer',
  templateUrl: './variables-viewer.component.html',
  styleUrls: ['./variables-viewer.component.scss'],
})
export class VariablesViewerComponent implements OnInit {

  @Input() variables: any = {};

  globalVariables: {name: string, value: any}[] = [];
  roles: string[] = [];
  subVariables: {name: string, value: any}[] = [];
  path = '';

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.getVariable('');




  }

  isGlobalVariable(key: string): boolean {
    return key.charAt(0) === '$';
  }

  isRoleVariable(key: string): boolean {
    return key.charAt(0) === '@';
  }

  cancel() {
    this.modalController.dismiss();
  }

  isObject(variable) {
    return typeof variable.value === 'object';
  }

  getVariable(path: string = '') {
    path = path.substring(1);
    this.path = path;
    let k = this.variables;
    const steps = path.split('.');
    const last = steps.pop();
    steps.forEach(e => (k[e] = k[e] || {}) && (k = k[e]));
    if (last !== '') {
      k = k[last];
    }

    this.globalVariables = [];
    this.roles = [];
    this.subVariables = [];
    Object.keys(k).forEach((key) => {
      if (path === '') {
        if (this.isGlobalVariable(key)) {
          this.globalVariables.push({
            name: key,
            value: this.variables[key]
          });
        } else if (this.isRoleVariable(key)) {
          this.roles.push(key);
        }
      } else {
        this.subVariables.push({
          name: key,
          value: k[key]
        });
      }
    });



  }

  getParent() {
    const list = this.path.split('.');
    list.pop();
    this.path = list.join('.');
    this.getVariable(this.path);
  }
}
