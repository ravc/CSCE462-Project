import { Component } from '@angular/core';
import { TestService } from '../SocketServices/TestService.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private test: TestService) {}
    
    ngOnInit() {
        this.test.messages.subscribe(msg => {
            console.log(msg);
        })
    }
    
    ngOnDestroy() {
        this.test.messages.unsubscribe();
    }
    
    sendMessage() {
        this.test.testConnection('The test');
    }
}
