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
                path: 'profile/:username',
                loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent),
                children: [
                    {
                        path: '',
                        redirectTo: 'posts',
                        pathMatch: 'full'
                    },
                    {
                        path: 'posts',
                        loadComponent: () => import('./profile/posts/posts.component').then(m => m.PostsComponent)
                    }
                ]
            }
        ]
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    },
];