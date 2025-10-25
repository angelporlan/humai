import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SearchComponent } from '../../components/search/search.component';
import { SubscribeComponent } from '../../home/subscribe/subscribe.component';
import { TopicsboxComponent } from '../../home/topicsbox/topicsbox.component';
import { PeopleboxComponent } from '../../home/peoplebox/peoplebox.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent, 
    SearchComponent, 
    SubscribeComponent, 
    TopicsboxComponent, 
    PeopleboxComponent
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent { }
