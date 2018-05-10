import { Injectable } from '@angular/core';
import { Client, xml } from '@xmpp/client';

const SERVICE_URL = 'ws://172.17.0.2:7070/ws/';

@Injectable()
export class XmppService {
  client = null;
  password = null;
  username = null;

  constructor() {
    this.client = new Client();
    this.setUpListeners();
  }

  async signIn(username, password) {
    this.username = username;
    this.password = password;
    this.client.start(SERVICE_URL);
  }

  private setUpListeners() {
    this.client.on('error', err => {
      console.error('❌', err.toString())
    })

    this.client.on('status', (status, value) => {
      console.log('🛈', status, value ? value.toString() : '')
    });

    this.client.on('online', jid => {
      console.log('🗸', 'online as', jid.toString())
      this.client.send(xml('presence'));
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

    this.client.handle('authenticate', authenticate => {
      return authenticate(this.username, this.password);
    });
  }

}
