import { Routes } from '@angular/router';
import { LayoutComponent } from './views/layout/layout.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
            },
            {
                path: 'profile',
                loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
            }
        ]
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    },
];

// export const routes: Routes = [
//     {
//         path: '',
//         redirectTo: 'home',
//         pathMatch: 'full'
//     },
//     {
//         path: 'auth',
//         loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
//     },
//     {
//         path: 'home',
//         loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
//     },
//     {
//         path: 'profile',
//         loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
//     }
// ];
