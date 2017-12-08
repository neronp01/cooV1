import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class DbService {
  private objectCollection: AngularFirestoreCollection<object>;
  tabObj: Observable<object[]>;
  uid: string;
  uidObs: BehaviorSubject<string>;
  constructor( private dbc: AngularFirestore) { }

getUid(path: string, compar: string, champ: string): BehaviorSubject<string> {
  this.uidObs = new BehaviorSubject('');
  let test: string;
    let returnValue: Observable<string | null>;
    let tabObject: Array<object>;
    tabObject = [];

    this.objectCollection = this.dbc.collection<object>('notesMembres');
  this.tabObj = this.objectCollection.snapshotChanges().map(actions => {
    return actions.map(a => {
      const data = a.payload.doc.data() as object;
      const id = a.payload.doc.id;
      tabObject.push(data);
      console.log('ici' , data['texte'], id);
      if ( data[champ] === compar) {
        console.log('ici' , data['texte'], id);
        test = id;
        this.uidObs.next(test);
        returnValue = Observable.create( obs => {
          obs.onNext(id);
          obs.onCompleted();
          return () => console.log('disposed');
          }
        )}
      return { id, ...data };
    });
  });
  return this.uidObs;
}
}
