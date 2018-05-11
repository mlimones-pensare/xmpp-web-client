import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { XmppService } from '../xmpp.service'

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  username='';
  password='';

  constructor(private xmpp: XmppService, private router: Router){
  }

  async ngOnInit() {
    if(await this.xmpp.isSignedIn()) {
      this.router.navigate(['/home']);
    }
  }

  async onSubmit(event) {
    try{
      await this.xmpp.signIn(this.username, this.password);
      this.router.navigate(['/home']);
    } catch(e) {
      console.log(e);
    }
  }
}
