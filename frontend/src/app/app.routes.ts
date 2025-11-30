import { Routes } from '@angular/router';
import { LayoutComponent } from './views/layout/layout.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'search',
                loadComponent: () => import('./search-results/search-results.component').then(m => m.SearchResultsComponent)
            },
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
                path: 'explore',
                loadComponent: () => import('./explore/explore.component').then(m => m.ExploreComponent)
            },
            {
                path: 'post/:postId',
                loadComponent: () => import('./post/post.component').then(m => m.PostComponent)
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
                    },
                    {
                        path: 'reactions',
                        loadComponent: () => import('./profile/reactions/reactions.component').then(m => m.ReactionsComponent)
                    },
                    {
                        path: 'comments',
                        loadComponent: () => import('./profile/comments/comments.component').then(m => m.CommentsComponent)
                    },
                    {
                        path: 'followers',
                        loadComponent: () => import('./profile/followers/followers.component').then(m => m.FollowersComponent)
                    },
                    {
                        path: 'following',
                        loadComponent: () => import('./profile/following/following.component').then(m => m.FollowingComponent)
                    }
                ]
            },
            {
                path: 'settings',
                loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent)
            },
            {
                path: 'notifications',
                loadComponent: () => import('./notifications/notifications.component').then(m => m.NotificationsComponent)
            }
        ]
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    },
];