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
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    ...canActivate(redirectUnauthorizedToLanding)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule),
    ...canActivate(redirectUnauthorizedToLanding)
  },
  {
    path: 'purchases',
    loadChildren: () => import('./purchases/main/main.module').then( m => m.MainPageModule),
    ...canActivate(redirectUnauthorizedToLanding)
  },
  {
    path: 'products',
    loadChildren: () => import('./purchases/products/products.module').then( m => m.ProductsPageModule),
    ...canActivate(redirectUnauthorizedToLanding)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule)
  },
  {
    path: 'card/purchase',
    loadChildren: () => import('./purchases/cards/purchase/purchase.module').then( m => m.PurchasePageModule),
    ...canActivate(redirectUnauthorizedToLanding)
  },
  {
    path: 'cards',
    loadChildren: () => import('./purchases/cards/cards/cards.module').then( m => m.CardsPageModule),
    ...canActivate(redirectUnauthorizedToLanding)
  },
  {
    path: 'reference/purchase',
    loadChildren: () => import('./purchases/reference/purchase/purchase.module').then( m => m.PurchasePageModule),
    ...canActivate(redirectUnauthorizedToLanding)
  },
  {
    path: 'reference/list',
    loadChildren: () => import('./purchases/reference/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile/profile.module').then( m => m.ProfilePageModule),
    ...canActivate(redirectUnauthorizedToLanding)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule),
    ...canActivate(redirectUnauthorizedToLanding)
  },
  {
    path: 'share',
    loadChildren: () => import('./share/share.module').then( m => m.SharePageModule),
    ...canActivate(redirectUnauthorizedToLanding)
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./contact-us/contact-us.module').then( m => m.ContactUsPageModule),
    ...canActivate(redirectUnauthorizedToLanding)
  },
  {
    path: 'promotions',
    loadChildren: () => import('./promotions/promotions.module').then( m => m.PromotionsPageModule),
    ...canActivate(redirectUnauthorizedToLanding)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
