import { Component, EventEmitter, Output } from '@angular/core';
import { FeedService } from '../../services/feed.service';

@Component({
  selector: 'app-sharebox',
  imports: [],
  templateUrl: './sharebox.component.html',
  styleUrl: './sharebox.component.css'
})
export class ShareboxComponent {
  @Output() newPost = new EventEmitter<any>();

  avatar = 'default';

  constructor(private feedService: FeedService) { }

  ngOnInit() {
    this.avatar = JSON.parse(localStorage.getItem('humai') || '{}').avatar || 'default';
  }

  postPost(content: string) {
    if (!content) return;
    this.feedService.postPost({
      content: content,
      is_public: true,
      meta: null
    }).subscribe({
      next: (response) => {
        console.log('Post creado exitosamente', response);
        const textarea = document.querySelector('textarea');
        if (textarea) textarea.value = '';
        this.newPost.emit(response.post);
      },
      error: (error) => {
        console.error('Error al crear el post', error);
      }
    });
  }
}
