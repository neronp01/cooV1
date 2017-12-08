import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireAction } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthService } from '../services/auth-service';

@Injectable()
export class NoteService {

  noteDoc:  AngularFirestoreDocument<object>;
  notesCollection: AngularFirestoreCollection<object>
  notes: Observable<object[]>;

  constructor(private dbc: AngularFirestore) {}

  listeNotes(courriel: string): Observable<object[]> {
    let notes = new Observable<object[]>();
    this.notesCollection = this.dbc.collection('notesMembres', ref => {
      return ref.where('id', '==', courriel)
    });
    this.notes = this.notesCollection.valueChanges();
    notes = this.notes;
    return notes;
  }

  addNote(note: object) {
    this.notesCollection = this.dbc.collection('notesMembres/');
    this.notesCollection.add(note);
  }
}
