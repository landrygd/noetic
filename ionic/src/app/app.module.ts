import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ImageCropperModule } from 'ngx-image-cropper';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { UserService } from './services/user.service';
import { SlidesService } from './services/slides.service';
import { BookService } from './services/book.service';
import { AuthService } from './services/auth.service';
import { IonicStorageModule } from '@ionic/storage';
import { ThemeService } from './services/theme.service';
import { Network } from '@ionic-native/network/ngx';
import { NetworkService } from './services/network.service';
import { ComponentModule } from './components/component.module';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { MediaService } from './services/media.service';
import { Facebook } from '@ionic-native/facebook/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';
import { TimeagoModule } from 'ngx-timeago';
import { PipesModule } from './pipes/pipes.module';

export const firebaseConfig = {
  apiKey: 'AIzaSyDAZRFBAHjrS8Ww03U95mMhX1-AD9rPDGo',
  authDomain: 'noetic-app.firebaseapp.com',
  databaseURL: 'https://noetic-app.firebaseio.com',
  projectId: 'noetic-app',
  storageBucket: 'noetic-app.appspot.com',
  messagingSenderId: '467577218262',
  appId: '1:467577218262:web:2914bf26f35fdfaaf8d577',
  measurementId: 'G-NLHMEK6CM5'
};

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    ImageCropperModule,
    ComponentModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    // tslint:disable-next-line: deprecation
    Globalization,
    Facebook,
    GooglePlus,
    LocalNotifications,
    SocialSharing,
    Network,
    AuthService,
    StatusBar,
    SplashScreen,
    UserService,
    BookService,
    SlidesService,
    ThemeService,
    NetworkService,
    MediaService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
