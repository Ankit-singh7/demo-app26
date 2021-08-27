// import { UserService } from './services/user.service';
// import { Network } from '@ionic-native/network/ngx';
import { APP_INITIALIZER, ErrorHandler, NgModule } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreenOrientation } from '@ionic-enterprise/screen-orientation/ngx';
import { PetSwitcherModule } from './global-components/layout/homepage-header/pet-switcher/pet-switcher.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NativeStorage } from '@ionic-enterprise/nativestorage/ngx';
import { WeightPopoverModule } from './global-components/weight-popover/weight-popover.module';
// import { IonicStorageModule } from '@ionic/storage';

// import { AngularFireModule } from '@angular/fire';
// import { AngularFirestoreModule } from '@angular/fire/firestore';
// import { firebaseConfig } from '../environments/environment';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InfoErrorPopoverModule } from './global-components/info-error-popover/info-error-popover.module';
import { Device } from '@ionic-enterprise/device/ngx';
import { Network } from '@ionic-enterprise/network-information/ngx';
import * as Sentry from "@sentry/angular";
import { DeviceInfoService } from './services/device-info.service';
import { AccountMenuModule } from './global-components/layout/homepage-header/account-menu/account-menu.module';
import { UserService } from "./services/user.service";
import { HttpClientModule } from "@angular/common/http";
import { OneTrustService } from "./services/one-trust.service";
import { SalesForceService } from "./services/salesforce.service";
import { AwsDataStoreService } from "./services/aws-data-store.service";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    PetSwitcherModule,
    AccountMenuModule,
    WeightPopoverModule,
    BrowserAnimationsModule,
    InfoErrorPopoverModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    // IonicStorageModule.forRoot(),
    // AngularFireModule.initializeApp(firebaseConfig),
    // AngularFirestoreModule,
  ],
  providers: [
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: false,
      }),
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (device: DeviceInfoService) => () => device.init(),
      deps: [DeviceInfoService],
      multi: true
    },
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NativeStorage,
    Device,
    Network,
    UserService,
    OneTrustService,
    SalesForceService,
    AwsDataStoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
