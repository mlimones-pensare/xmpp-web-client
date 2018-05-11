import { Injectable } from '@angular/core';
import { Client, xml } from '@xmpp/client';

import { StorageService } from './storage.service';

const SERVICE_URL = 'ws://172.17.0.2:7070/ws/';

@Injectable()
export class XmppService {
  client = null;
  signedIn = false;
  jid = null;

  constructor(private storage: StorageService) {
    this.client = new Client();
  }

  private setUpListeners() {
  }

  async isSignedIn(){
    if(!this.signedIn){
      await this.loadCredentialsAndSignIn();
    }
    return this.signedIn;
  }

  onSuccessfulAuthentication(jid, username, password){
    this.saveCredentials(username, password);
    this.jid = jid;
    this.signedIn = true;

    this.client.on('status', (status, value) => {
      console.log('🛈', status, value ? value.toString() : '')
    });

    this.client.on('stanza', stanza => {
      if(stanza.name === 'message') {
        if(stanza.attrs.type = 'chat') {
          let body = stanza.getChild('body');
          let composing = stanza.getChild('composing');
          let paused = stanza.getChild('paused');
          if(body) {
            let message = body.text();
            console.log('message:', message);
          } else if(composing) {
            console.log('started writing!');
          } else if(paused) {
            console.log('stoped writing!');
          } else {
            console.log('⮈', stanza);
          }
        }
      } else {
        console.log('⮈', stanza);
      }
    });
  }

  saveCredentials(username, password){
    this.storage.setItem('username', username);
    this.storage.setItem('password', password);
  }

  async loadCredentialsAndSignIn() {
    let credentials = this.loadCredentials();
    if(credentials){
      let {username, password} = credentials;
      return this.signIn(username, password);
    }else{
      return {status: 'no credentials exist'};
    }
  }

  loadCredentials(){
    let username = this.storage.getItem('username');
    let password = this.storage.getItem('password');
    if((!!username) && (!!password)){
      return {username, password};
    }else{
      return null;
    }
  }

  async signIn(username, password) {
    return new Promise((resolve, reject) => {
      this.client.on('error', err => {
        console.error('❌', err.toString())
        reject(err);
      })

      this.client.on('online', jid => {
        this.onSuccessfulAuthentication(jid, username, password);
        this.client.send(xml('presence'));
        resolve(jid);
      });

      this.client.handle('authenticate', authenticate => {
        return authenticate(username, password);
      });

      this.client.start(SERVICE_URL);
    });
  }
}
