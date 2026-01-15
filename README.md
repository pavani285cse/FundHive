# FundHive - Chit Fund Management System

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.17.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## JSON Server (Mock API)

Run `npm run json-server` to start the mock REST API server on `http://localhost:3001`.

To run both Angular dev server and JSON Server together:
```bash
npm run start:all
```

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Features

- **Authentication**: Login with role-based access (ADMIN/MEMBER)
- **Dashboard**: Summary cards and charts for chit fund analytics
- **Chit Groups Management**: View and manage chit groups
- **Members Management**: View and manage members
- **Auctions**: Track auction details
- **Payments**: Monitor contributions and penalties
- **Reports**: Visual reports with charts

## Tech Stack

- Angular 17 (Standalone Components)
- Angular Material UI
- Chart.js (via ng2-charts)
- RxJS
- JSON Server (Mock API)
- TypeScript

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
