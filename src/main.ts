import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as Sentry from "@sentry/angular";
import { Integrations } from "@sentry/tracing";

if (environment.production) {
  enableProdMode();
  Sentry.init({
    dsn: "",
    integrations: [ new Integrations.BrowserTracing() ],
    tracesSampleRate: 1.0,
    environment: "production"
  });
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
