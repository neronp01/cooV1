import {Component, ElementRef, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import { InfPersoInscMembService, Membre } from '../../services/inf-perso-insc-memb.service';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';


@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.css'],
  providers: [ InfPersoInscMembService ]
})



export class ListeComponent {
  @Input () etat: string;
  @Output() envoieCourriel = new EventEmitter <Array<string>>();
  @Output () edit = new EventEmitter <Array<string>>();
  displayedColumns = ['userId', 'userName', 'progress', 'color'];
  exampleDatabase: ExampleDatabase;
  dataSource: ExampleDataSource | null;
  courriel = [];
  nom = [];

  @ViewChild('filter') filter: ElementRef;
  constructor(private memb: InfPersoInscMembService) {
    const tel = [];
    const nom = [];
    const pre = [];
    const ville = [];
    const cour = [];
memb.listeMembre.subscribe( x => {
  // this.courriel.push(x['data'].courriel);
  // this.nom.push(x['data'].prenom);
  const data = [];
  data.push(x);

  data[0].forEach( z => {
    const temp = z.data;
    tel.push(temp.telephone);
    nom.push(temp.nom);
    pre.push(temp.prenom);
    ville.push(temp.ville);
    cour.push(temp.courriel);
  });
  this.exampleDatabase = new ExampleDatabase(tel, nom, pre, ville, cour);
  this.dataSource = new ExampleDataSource(this.exampleDatabase);
  Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.dataSource) { return; }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  console.log(NAMES, COLORS);
})
  }
  ngOnInit() {
    // this.dataSource = new ExampleDataSource(this.exampleDatabase);
    // Observable.fromEvent(this.filter.nativeElement, 'keyup')
    //   .debounceTime(150)
    //   .distinctUntilChanged()
    //   .subscribe(() => {
    //     if (!this.dataSource) { return; }
    //     this.dataSource.filter = this.filter.nativeElement.value;
    //   });
  }
  envoieCourrielClick(e: any){
    this.envoieCourriel.emit(['courriel', e]);
    console.log(e);
  }

  editClick(e: any){
    this.edit.emit(['overviewEdit', e]);
    console.log(e);
  }
  roleClick(e: any) {
    this.edit.emit(['role', e]);
  }
  messageClick(e: any) {
    this.edit.emit(['message', e]);
  }
}
const NAMES = ['maroon', 'red', 'orange', 'yellow'];
const COLORS = [ 'Charlotte', 'Theodore', 'Isla', 'Oliver'];
/** Constants used to fill up our data base. */
// const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
//   'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
// const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
//   'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
//   'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

export interface UserData {
  nom: string;
  ville: string;
  tel: string;
  courriel: string;
}

export interface IListeMembre {
  courriel: string;
  nom: string;
  prenom: string;
  ville: string;
  telephone: string;
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<UserData[]> = new BehaviorSubject<UserData[]>([]);
  get data(): UserData[] { return this.dataChange.value; }
  tel: Array<string>;
  nom: Array<string>;
  pre: Array<string>;
  ville: Array<string>;
  cour: Array<string>;
  constructor(_col: Array<string>, _nom: Array<string>, _pre: Array<string>, _ville: Array<string>, _cour: Array<string>) {
    this.tel = _col;
    this.nom = _nom;
    this.pre = _pre;
    this.ville = _ville;
    this.cour = _cour;
    // Fill up the database with 100 users.
    for (let i = 0; i < this.nom.length; i++) { this.addUser(i); }
  }

  /** Adds a new user to the database. */
  addUser(a: number) {
    const copiedData = this.data.slice();
    copiedData.push( this.createNewUser(a) );
    this.dataChange.next(copiedData);
  }

  /** Builds and returns a new User. */
  private createNewUser(a: number) {
    return {
      nom: this.nom[a] + ', ' + this.pre[a],
      ville: this.ville[a],
      tel:  '(' + this.tel[a].substring(0, 3) + ') ' + this.tel[a].substring(3, 6) + '-' + this.tel[a].substring(6, 10),
      courriel: this.cour[a]
    };
  }
}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class ExampleDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  constructor(private _exampleDatabase: ExampleDatabase) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<UserData[]> {
    console.log('la', this._exampleDatabase);
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._filterChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {

      return this._exampleDatabase.data.slice().filter((item: UserData) => {
        let searchStr = (item.nom ).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });
    });
  }
  disconnect() {}
}
