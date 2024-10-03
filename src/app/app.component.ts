import { PortalModule } from '@angular/cdk/portal';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { NgxAppVersionDirective } from 'ngx-app-version';
import { NgxFixedFooterDirective } from 'ngx-fixed-footer';
import { VERSION } from 'src/environments/version';
import { SideMenuService } from './shared/services/side-menu-service';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  hostDirectives: [NgxAppVersionDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    RouterOutlet,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    LocalizeRouterModule,
    PortalModule,
    NgxFixedFooterDirective,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    CommonModule,
    RouterLinkActive,
  ],
})
export class AppComponent {
  public endYear = new Date(VERSION.date).getFullYear();

  constructor(public sideMenuService: SideMenuService) {}
}
