import { Component } from '@angular/core';

import { XmppService } from './xmpp.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  username='';
  password='';

  constructor(private xmpp: XmppService){
  }

  async onSubmit(event){
    let res = await this.xmpp.signIn(this.username, this.password);
    console.log(res);
  }
}
