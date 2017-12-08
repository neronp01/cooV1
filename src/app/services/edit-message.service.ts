import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

export interface ObjectId {
  id: string,
  data: object
}

@Injectable()
export class EditMessageService {
  messageDoc:  AngularFirestoreDocument<ObjectId>;
  messageCollection: AngularFirestoreCollection<ObjectId>
  messages: Observable<ObjectId[]>;

  constructor(private dbc: AngularFirestore) { }

  addMessage(message: object) {
    const id = '1';
    const data = message;
    const item: ObjectId = { id, data };
    this.messageCollection = this.dbc.collection('messageMembres/');
    this.messageCollection.add(item);
  }

  get listeEditMessage(): Observable<ObjectId[]> {
    let messages = new Observable<ObjectId[]>();
    this.messageCollection = this.dbc.collection('messageMembres/', ref => {
      return ref.orderBy('data.date');
    });
    this.messages = this.messageCollection.valueChanges();
    messages = this.messages;
    return messages;
  }
}
