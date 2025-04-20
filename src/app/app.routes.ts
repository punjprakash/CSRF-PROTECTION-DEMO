import { Routes } from '@angular/router';
import { UserProfileComponent } from './features/user-profile/user-profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path: 'profile', component: UserProfileComponent }
];
