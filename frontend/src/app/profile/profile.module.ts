import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { ProfileService } from '../services/profile.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ProfileRoutingModule,
    // Importamos el componente standalone aquí
    ProfileComponent
  ],
  providers: [
    ProfileService
  ]
})
export class ProfileModule { }
