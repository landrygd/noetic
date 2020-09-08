import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  variables: any = {};

  constructor() { }

  init() {
    this.variables = {};
  }

  setValue(path) {
    let k = this.variables;
    const steps = path.split('.');
    steps.forEach(e => (k[e] = k[e] || {}) && (k = k[e]));
  }
}
