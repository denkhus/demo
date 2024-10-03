import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CustomTitleStrategyService extends TitleStrategy {
  private readonly siteName = 'Test';

  constructor(private title: Title) {
    super();
  }

  public updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot);
    if (title) {
      const res = JSON.parse(title) as { section: string[] };
      this.title.setTitle(res.section[0]);
    } else {
      this.title.setTitle(this.siteName);
    }
  }
}
