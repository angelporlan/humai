import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { FeedService } from '../../services/feed.service';
import { Router } from '@angular/router';
import { FlashService } from '../../services/flash.service';

@Component({
  selector: 'app-sharebox',
  standalone: true,
  imports: [],
  templateUrl: './sharebox.component.html',
  styleUrl: './sharebox.component.css'
})
export class ShareboxComponent {
  @Output() newPost = new EventEmitter<any>();
  @Input() isAComment: boolean = false;
  @Input() postId: number = 0;

  @ViewChild('postDiv') postDiv!: ElementRef;

  avatar = 'default';
  textDefault = '¿Qué estás pensando?';

  constructor(
    private feedService: FeedService,
    private router: Router,
    private flashService: FlashService
  ) { }

  ngOnInit() {
    this.avatar = JSON.parse(localStorage.getItem('humai') || '{}').avatar || 'default';
    this.textDefault = this.isAComment ? 'Postea tu respuesta...' : '¿Qué estás pensando?';
  }

  onInput(e: any) { }

  toggleHighlight() {
    this.postDiv.nativeElement.focus();
    document.execCommand('bold', false);
  }

  handleKeydown(e: KeyboardEvent) {
    if (e.key === '#') {
      e.preventDefault();
      if (!document.queryCommandState('bold')) {
        document.execCommand('bold', false);
      }
    }

    if (e.key === ' ' || e.key === 'Enter') {
      if (document.queryCommandState('bold')) {
        document.execCommand('bold', false);
      }
    }
  }

  prepareAndPost() {
    const divContent = this.postDiv.nativeElement;
    const clone = divContent.cloneNode(true);

    const bolds = clone.querySelectorAll('b, strong, span[style*="font-weight: bold"]');

    bolds.forEach((el: HTMLElement) => {
      if (!el.innerText.startsWith('#')) {
        el.innerText = '#' + el.innerText;
      }
    });

    let finalContent = clone.innerText || clone.textContent;

    finalContent = finalContent.replace(/\u00A0/g, ' ');

    this.handlePost(finalContent);
  }

  handlePost(content: string) {
    if (!content || content.trim() === '') return;

    this.feedService.postPost({
      content: content,
      is_public: true,
      meta: null,
      tags: content.match(/#[\wñÑáéíóúÁÉÍÓÚ]+/g)?.map(tag => tag.substring(1)) || [],
      ...(this.isAComment && { parent_post: this.postId }),
    }).subscribe({
      next: (response) => {
        console.log('Post creado', response);
        if (this.postDiv) this.postDiv.nativeElement.innerHTML = '';
        this.newPost.emit(response.post);

        if (this.isAComment) {
          this.flashService.success('¡Comentario publicado correctamente!');
        } else {
          this.flashService.success('¡Post publicado correctamente!');
        }
      },
      error: (error) => {
        console.error('Error', error);
        if (this.isAComment) {
          this.flashService.error('Error al publicar el comentario. Inténtalo de nuevo.');
        } else {
          this.flashService.error('Error al publicar el post. Inténtalo de nuevo.');
        }
      }
    });
  }
}