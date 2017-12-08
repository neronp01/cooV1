import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { Observable } from 'rxjs/Observable';
import { Router,
  NavigationExtras } from '@angular/router';
import { InfPersoInscMembService } from '../services/inf-perso-insc-memb.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ AuthService ],
})
export class LoginComponent implements OnInit {

parent = 'login';
  constructor( public  se: AuthService, public router: Router, private memb: InfPersoInscMembService ) { }

  ngOnInit() {

  }
  googleLogin() {
      this.se.googleLogin().then((data) => {
        const courriel = this.se.currentUserEmail;
        let estInscrit: boolean;
        let membre: Array<string>;
        membre = [];
        estInscrit = false;
        this.memb.listeMembre.subscribe( x => {
          x.forEach( y => {
            const temp = y['data'];
            if (y['id'] === courriel) {
              if (temp['estMembreActif']) {
                estInscrit = true;
              }
            }
          });
          if (estInscrit) {
            this.router.navigate(['/membre/home'])
          } else {
            this.router.navigate(['/membre/inscription'])
          }
        });
      });
  //  return this.se.googleLogin();
  }
  facebookLogin() {
    return this.se.facebookLogin();
  }
  twitterLogin() {

    return this.se.twitterLogin().then((data) => {
      this.router.navigate(['/inscription'])});
  }
  logout() {
    return  this.se.logout();
  }
  getAuth(){
    console.log(this.se.currentUserId);
  }
test(){
    console.log(this.se.isLoggedIn);
}

estUnMembre(): boolean {
  return false;
}
}

