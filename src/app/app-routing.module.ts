import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { map } from 'rxjs/operators';

const redirectUnauthorizedToLanding = redirectUnauthorizedTo(['auth']);
const usersOnly = () => map((user:any) => user.roles.includes('user') ? ['profiles', user.uid, 'edit'] : ['login']);
const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    ...canActivate(redirectUnauthorizedToLanding)
  },
  {
    path: 'list',
    loadChildren: () => import('./pages/list/list.module').then(m => m.ListPageModule),
    ...canActivate(redirectUnauthorizedToLanding)
  },
  {
    path: 'purchases',
    loadChildren: () => import('./pages/purchases/main/main.module').then( m => m.MainPageModule),
    ...canActivate(redirectUnauthorizedToLanding)
  },
  {
    path: 'products',
    loadChildren: () => import('./pages/purchases/products/products.module').then( m => m.ProductsPageModule),
    ...canActivate(redirectUnauthorizedToLanding)
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthModule)
  },
  {
    path: 'card/purchase',
    loadChildren: () => import('./pages/purchases/cards/purchase/purchase.module').then( m => m.PurchasePageModule),
    ...canActivate(redirectUnauthorizedToLanding)
  },
  {
    path: 'cards',
    loadChildren: () => import('./pages/purchases/cards/cards/cards.module').then( m => m.CardsPageModule),
    ...canActivate(redirectUnauthorizedToLanding)
  },
  {
    path: 'reference/purchase',
    loadChildren: () => import('./pages/purchases/reference/purchase/purchase.module').then( m => m.PurchasePageModule),
    ...canActivate(redirectUnauthorizedToLanding)
  },
  {
    path: 'reference/list',
    loadChildren: () => import('./pages/purchases/reference/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile/profile.module').then( m => m.ProfilePageModule),
    ...canActivate(redirectUnauthorizedToLanding)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications.module').then( m => m.NotificationsPageModule),
    ...canActivate(redirectUnauthorizedToLanding)
  },
  {
    path: 'share',
    loadChildren: () => import('./pages/share/share.module').then( m => m.SharePageModule),
    ...canActivate(redirectUnauthorizedToLanding)
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./pages/contact-us/contact-us.module').then( m => m.ContactUsPageModule),
    ...canActivate(redirectUnauthorizedToLanding)
  },
  {
    path: 'regulation/:from',
    loadChildren: () => import('./pages/regulation/regulation.module').then( m => m.RegulationPageModule),
		// ...canActivate(redirectUnauthorizedToLanding)
  },
  {
    path: 'faq',
    loadChildren: () => import('./pages/faq/faq.module').then( m => m.FAQPageModule),
    ...canActivate(redirectUnauthorizedToLanding)
  },
  {
    path: 'promotions',
    loadChildren: () => import('./pages/promotions/promotions.module').then( m => m.PromotionsPageModule),
    ...canActivate(redirectUnauthorizedToLanding)
  },
  {
    path: 'profile-detail',
    loadChildren: () => import('./pages/profile-detail/profile-detail.module').then( m => m.ProfileDetailPageModule)
  },
  {
    path: 'info-user-pre-register-modal',
    loadChildren: () => import('./modals/info-user-pre-register-modal/info-user-pre-register-modal.module').then( m => m.InfoUserPreRegisterModalPageModule)
  },
  {
    path: 'check-request-pre-register',
    loadChildren: () => import('./pages/check-request-pre-register/check-request-pre-register.module').then( m => m.CheckRequestPreRegisterPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
