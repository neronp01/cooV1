// L'authguard est utilisé pour empêcher les utilisateurs
// non authentifiés d'accéder à des routes restreintes,
// il est utilisé dans app.routing.ts pour protéger
// l'itinéraire de la page d'accueil. Pour plus
// d'informations sur les 2 gardes angulaires,
// vous pouvez consulter cette publication sur le
// blog thoughtram.


import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationExtras,
  CanLoad, Route
} from '@angular/router';
import { AuthService } from './auth-service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    this.authService.user.subscribe(() => {
   //   console.log('active observable', this.authService.authenticated);
      return this.checkLogin(url, this.authService.authenticated );
    })
    return this.checkLogin(url, this.authService.authenticated);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {
    const url = `/${route.path}`;
    return this.checkLogin(url, true);
  }

  checkLogin(url: string, a: boolean): boolean {
    if (a) {
      return true; }
      // Store the attempted URL for redirecting
      this.authService.redirectUrl = url;

      // Create a dummy session id
      const sessionId = 123456789;

      // Set our navigation extras object
      // that contains our global query params and fragment
      const navigationExtras: NavigationExtras = {
        queryParams: { 'session_id': sessionId },
        fragment: 'anchor'
      };

      // Navigate to the login page with extras
      this.router.navigate(['/login'], navigationExtras);
      return false;
  }
}
