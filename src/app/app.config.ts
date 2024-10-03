import { ApplicationConfig, importProvidersFrom, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TitleStrategy, provideRouter } from '@angular/router';

import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAppVersion } from 'ngx-app-version';
import { provideFixedFooter } from 'ngx-fixed-footer';
import { VERSION } from '../environments/version';
import { routes } from './app.routes';
import { CustomTitleStrategyService } from './shared/services/custom-title-strategy.service';
import { MatPaginationIntlService } from './shared/services/mat-paginator-intl.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideAppVersion({
      version: VERSION.version,
    }),
    provideFixedFooter({
      containerSelector: '.permanent-main',
      cssAttribute: 'margin',
    }),
    provideHttpClient(),
    importProvidersFrom(BrowserModule, BrowserAnimationsModule, MatSnackBarModule, MatDialogModule, CommonModule),
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { verticalPosition: 'top', horizontalPosition: 'right' } },
    { provide: TitleStrategy, useClass: CustomTitleStrategyService },
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginationIntlService,
    },
  ],
};
