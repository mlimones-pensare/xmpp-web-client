import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { XmppService } from '../xmpp.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private xmpp: XmppService, private router: Router){
  }

  async ngOnInit() {
    if(!(await this.xmpp.isSignedIn())) {
      this.router.navigate(['/signin']);
    }
  }

}
