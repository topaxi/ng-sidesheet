# NgSidesheet

A sidesheet directive for Angular.

Currently the Sidesheet only supports one position,
on the right side of the screen.

## Usage

Import NgSidesheetModule in your App.

```typescript
import { NgModule } from '@angular/core';
import { NgSidesheetModule } from 'ng-sidesheet';

@NgModule({
  imports: [NgSidesheetModule]
})
export class AppModule {}
```

Use in template:

```html
<div *ngSidesheet>
  This div is rendered in the sidesheet
</div>
```

Render once the value is not nullish anymore:

```html
<div *ngSidesheet="'right' with model$ | async as model">
  Only rendered once {{model}} is not null or undefined.
</div>
```

Act on close event of Sidesheet:

```typescript
@Component({
  template: `
    <div *ngSidesheet="'right'; close: onSidesheetClose">
      Sidesheet content
    </div>
  `
})
export class AppComponent {
  onSidesheetClose: () => {
    console.log('Sidesheet closed')
  }
}
```

Overwrite overlay settings:

```typescript
@Component({
  template: `
    <div *ngSidesheet="'right'; overlay: false">
      Sidesheet content without overlay
    </div>
    <div *ngSidesheet="'right'; overlayCloseOnClick: false">
      Don't close Sidesheet on overlay click
    </div>
    <div *ngSidesheet="'right'; overlayCloseOnESC: false">
      Don't close Sidesheet on pressing ESC key
    </div>
  `
})
export class AppComponent {}
```

## Advanced configuration

Globally overwrite Sidesheet default parameters:

```typescript
import { NgModule } from '@angular/core';
import { NgSidesheetModule } from 'ng-sidesheet';

@NgModule({
  imports: [
    NgSidesheetModule.withConfig({
      closeButton: false, // disable/hide close button
      scrollShadow: false, // disable shadow for vertical scrolling
      overlay: false, // disable backdrop overlay
      overlayCloseOnClick: false, // do not close sidesheet on overlay click
      overlayCloseOnESC: false // do not close sidesheet on ESC key
    })
  ]
})
export class AppModule {}
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
