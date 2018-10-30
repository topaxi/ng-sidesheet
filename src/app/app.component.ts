import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-sidesheet-app';
  open = true;

  onClose = () => {
    console.log('onClose');

    this.open = false;
  };
}
