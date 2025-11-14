import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FeedService } from '../../services/feed.service';

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

  constructor(private feedService: FeedService) { }

  ngOnInit() {
    this.avatar = JSON.parse(localStorage.getItem('humai') || '{}').avatar || 'default';
    this.textDefault = this.isAComment ? 'Postea tu respuesta...' : '¿Qué estás pensando?';
  }

  handlePost(content: string) {
    if (!content) return;

    if (this.isAComment) {
      this.postComment(content);
    } else {
      this.postPost(content);
    }
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

  postComment(content: string) {
    if (!content) return;

    this.feedService.commentToAPost(this.postId, content).subscribe({
      next: (response) => {
        console.log('Comentario creado exitosamente', response);
        const textarea = document.querySelector('textarea');
        if (textarea) textarea.value = '';
        this.newPost.emit(response.post);
      },
      error: (error) => {
        console.error('Error al crear el comentario', error);
      }
    });
  }
}
