import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NetworkService } from '../services/network.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkGuard implements CanActivate {

  constructor(public networkService: NetworkService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.networkService.isOnline;
  }
}
