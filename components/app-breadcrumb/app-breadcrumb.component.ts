import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthPathConfig } from '../../auth/core';
import { BreadCrumbStore } from './breadcrumb-store';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './app-breadcrumb.component.html',
  styleUrls: ['./app-breadcrumb.component.css']
})
export class AppBreadcrumbComponent implements OnInit {
  constructor(public breadCrumbs: BreadCrumbStore, private router: Router) {}

  ngOnInit() {}

  getRoutePrefix(route: string) {
    return `${route}`;
  }

  private navigateToRoot() {
    this.router.navigate([AuthPathConfig.LOGIN_PATH], { replaceUrl: true });
  }
}
