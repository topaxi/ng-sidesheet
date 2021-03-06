import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-sidesheet-app';
  open = true;
  backdrop = true;

  onClose = () => {
    this.open = false;
  };
}
