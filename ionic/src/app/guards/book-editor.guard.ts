import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BookService } from '../services/book.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BookEditorGuard implements CanActivate {
  constructor(
    public bookService: BookService,
    public navCtrl: NavController
    ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.bookService.book) {
        return true;
      } else {
        this.navCtrl.navigateBack('/');
      }
  }
}
