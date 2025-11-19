import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FeedService } from '../../services/feed.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sharebox',
  imports: [],
  templateUrl: './sharebox.component.html',
  styleUrl: './sharebox.component.css'
})
export class ShareboxComponent {
  @Output() newPost = new EventEmitter<any>();
  @Input() isAComment: boolean = false;
  @Input() postId: number = 0;

  avatar = 'default';
  textDefault = '¿Qué estás pensando?';

  constructor(private feedService: FeedService, private router: Router) { }

  ngOnInit() {
    this.avatar = JSON.parse(localStorage.getItem('humai') || '{}').avatar || 'default';
    this.textDefault = this.isAComment ? 'Postea tu respuesta...' : '¿Qué estás pensando?';
  }

  handlePost(content: string) {
    if (!content) return;

    this.feedService.postPost({
      content: content,
      is_public: true,
      meta: null,
      ...(this.isAComment && { parent_post: this.postId }),
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
