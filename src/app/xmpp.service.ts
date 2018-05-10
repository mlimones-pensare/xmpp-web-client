import { Injectable } from '@angular/core';

@Injectable()
export class XmppService {

  constructor() { }

  async signIn(username, password){
    console.log(`user:${username}, pass:${password}`);
    return {status: 'ok'};
  }

}
