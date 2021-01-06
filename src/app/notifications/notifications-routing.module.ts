import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationsPage } from './notifications.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationsPage
  },
  {
    path: 'reminders',
    loadChildren: () => import('./reminders/reminders.module').then( m => m.RemindersPageModule)
  },
  {
    path: 'stops-list',
    loadChildren: () => import('./stops-list/stops-list.module').then( m => m.StopsListPageModule)
  },
  {
    path: 'messages',
    loadChildren: () => import('./messages/messages.module').then( m => m.MessagesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationsPageRoutingModule {}
