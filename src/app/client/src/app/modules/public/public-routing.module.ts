import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GetComponent } from './components/get/get.component';
import { DialCodeComponent } from './components/dial-code/dial-code.component';
import { PublicFooterComponent } from './components/public-footer/public-footer.component';
import {
  LandingPageComponent, PublicContentPlayerComponent,
  PublicCollectionPlayerComponent
} from './components';
import { LandingpageGuard } from './services';
// #NUIH change:
import { NuihComponent, LearnComponent, InnovateComponent, DataExchangeComponent, SmartGovComponent, AboutusComponent, ComingSoonComponent } from './module/nuih';
const routes: Routes = [
  {
    path: '', // root path '/' for the app
    component: LandingPageComponent,
    canActivate: [LandingpageGuard],
    data: {
      telemetry: {
        env: 'public', pageid: 'landing-page', type: 'edit', subtype: 'paginate'
      }
    }
  },
  {
    path: 'get', component: GetComponent, data: {
      telemetry: {
        env: 'public', pageid: 'get', type: 'view', subtype: 'paginate'
      }
    }
  },
  {
    path: 'get/dial/:dialCode', component: DialCodeComponent, data: {
      telemetry: {
        env: 'public', pageid: 'get-dial', type: 'view', subtype: 'paginate'
      }
    }
  },
  {
    path: 'play/content/:contentId', component: PublicContentPlayerComponent, data: {
      telemetry: {
        env: 'public', pageid: 'play-content', type: 'view', subtype: 'paginate'
      }
    }
  },
  {
    path: 'play/collection/:collectionId', component: PublicCollectionPlayerComponent, data: {
      telemetry: {
        env: 'public', pageid: 'play-collection', type: 'view', subtype: 'paginate'
      }
    }
  },
  {
    path: 'explore', loadChildren: './module/explore/explore.module#ExploreModule'
  },
  {
    path: ':slug/explore', loadChildren: './module/explore/explore.module#ExploreModule'
  },
  {
    path: 'explore-course', loadChildren: './module/course/course.module#CourseModule'
  },
  {
    path: ':slug/explore-course', loadChildren: './module/course/course.module#CourseModule'
  },
  {
    path: ':slug/signup', loadChildren: './module/signup/signup.module#SignupModule'
  },
  {
    path: 'signup', loadChildren: './module/signup/signup.module#SignupModule'
  },
  {
    path: 'register', loadChildren: './module/self-register/self-register.module#SelfRegisterModule'
  },
  {
    path: ':slug/sign-in/sso', loadChildren: './module/sign-in/sso/sso.module#SsoModule'
  },
  {
    path: 'sign-in/sso', loadChildren: './module/sign-in/sso/sso.module#SsoModule'
  },
  {
    path: 'nuis', component: NuihComponent, data: {
      telemetry: {
        env: 'public', pageid: 'nuis', type: 'view', subtype: 'paginate'
      }
    }
  },
  {
    path: 'lms', component: LearnComponent, data: {
      telemetry: {
        env: 'public', pageid: 'lms', type: 'view', subtype: 'paginate'
      }
    }
  },
  {
    path: 'innovate', component: InnovateComponent, data: {
      telemetry: {
        env: 'public', pageid: 'innovate', type: 'view', subtype: 'paginate'
      }
    }
  },
  {
    path: 'iudx', component: DataExchangeComponent, data: {
      telemetry: {
        env: 'public', pageid: 'iudx', type: 'view', subtype: 'paginate'
      }
    }
  },
  {
    path: 'smartgov', component: SmartGovComponent, data: {
      telemetry: {
        env: 'public', pageid: 'smartgov', type: 'view', subtype: 'paginate'
      }
    }
  },
  {
    path: 'aboutus', component: AboutusComponent, data: {
      telemetry: {
        env: 'public', pageid: 'aboutus', type: 'view', subtype: 'paginate'
      }
    }
  },
  {
    path: 'comingsoon', component: ComingSoonComponent, data: {
      telemetry: {
        env: 'public', pageid: 'comingsoon', type: 'view', subtype: 'paginate'
      }
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
