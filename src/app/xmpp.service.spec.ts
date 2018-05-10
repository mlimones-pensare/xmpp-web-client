import { TestBed, inject } from '@angular/core/testing';

import { XmppService } from './xmpp.service';

describe('XmppService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [XmppService]
    });
  });

  it('should be created', inject([XmppService], (service: XmppService) => {
    expect(service).toBeTruthy();
  }));
});
