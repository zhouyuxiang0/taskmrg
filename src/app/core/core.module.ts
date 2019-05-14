import '../utils/debug.util';
import 'hammerjs';

import { NgModule, Optional, SkipSelf } from '@angular/core';

import { AppRoutingModule } from '../app-routing.module';
import { AppStoreModule } from '../reducers/index';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material/icon';
import { ServicesModule } from '../services/services.module';
import { SharedModule } from '../shared/shared.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { loadSvgResources } from '../utils/svg.utils';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent
  ],
  imports: [
    AppStoreModule,
    CommonModule,
    SharedModule,
    ServicesModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AppRoutingModule
  ],
  providers: [{
    provide: 'BASE_CONFIG',
    useValue: {
      uri: 'http://localhost:3000'
    }
  }]
})
export class CoreModule {
  constructor(
    @Optional() @SkipSelf() parent: CoreModule,
    ir: MatIconRegistry,
    ds: DomSanitizer
  ) {
    if (parent) {
      throw new Error('模块已经存在，不能再次加载!');
    }
    loadSvgResources(ir, ds);
  }
}
