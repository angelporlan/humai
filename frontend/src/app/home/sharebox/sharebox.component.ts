import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { FeedService } from '../../services/feed.service';
import { Router } from '@angular/router';

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

  constructor(private feedService: FeedService, private router: Router) { }

  ngOnInit() {
    this.avatar = JSON.parse(localStorage.getItem('humai') || '{}').avatar || 'default';
    this.textDefault = this.isAComment ? 'Postea tu respuesta...' : '¿Qué estás pensando?';
  }

  onInput(e: any) { }

  toggleHighlight() {
    this.postDiv.nativeElement.focus();
    document.execCommand('bold', false);
  }

  /**
   * Mágico manejo del teclado para simular hashtags y romper espacios
   */
  handleKeydown(e: KeyboardEvent) {
    // 1. Si el usuario presiona '#', activamos negrita y no escribimos el '#'
    if (e.key === '#') {
      e.preventDefault(); // Evita que aparezca el caracter '#'
      // Solo activamos negrita si no está activa ya
      if (!document.queryCommandState('bold')) {
        document.execCommand('bold', false);
      }
    }

    // 2. Si el usuario presiona Espacio o Enter, desactivamos negrita
    if (e.key === ' ' || e.key === 'Enter') {
      // Si estamos escribiendo en negrita...
      if (document.queryCommandState('bold')) {
        // Desactivamos negrita para que el espacio sea texto plano
        document.execCommand('bold', false);
        // El navegador insertará el espacio justo después, ya fuera de la etiqueta <b>
      }
    }
  }

  prepareAndPost() {
    const divContent = this.postDiv.nativeElement;
    const clone = divContent.cloneNode(true); // Clonamos para no alterar la vista

    // Buscamos las negritas
    const bolds = clone.querySelectorAll('b, strong, span[style*="font-weight: bold"]');

    bolds.forEach((el: HTMLElement) => {
      // Si ya tiene un # visual (raro, pero posible), no lo duplicamos
      if (!el.innerText.startsWith('#')) {
        // AÑADIMOS EL # AL PRINCIPIO INTERNAMENTE
        // NOTA: Ya no quitamos espacios con replace(/\s/g, '') 
        // porque tu lógica de teclado 'handleKeydown' impide espacios dentro de la negrita.
        // Si el usuario seleccionó una frase entera y le dio al botón B, 
        // se convertirá en "#Hola Mundo" (lo cual romperá el tag en el espacio, comportamiento estándar).
        el.innerText = '#' + el.innerText;
      }
    });

    let finalContent = clone.innerText || clone.textContent;

    // Limpieza extra: Evitar dobles espacios si el navegador se lía
    finalContent = finalContent.replace(/\u00A0/g, ' ');

    this.handlePost(finalContent);
  }

  handlePost(content: string) {
    if (!content || content.trim() === '') return;

    this.feedService.postPost({
      content: content,
      is_public: true,
      meta: null,
      // Tu regex original
      tags: content.match(/#[\wñÑáéíóúÁÉÍÓÚ]+/g)?.map(tag => tag.substring(1)) || [],
      ...(this.isAComment && { parent_post: this.postId }),
    }).subscribe({
      next: (response) => {
        console.log('Post creado', response);
        if (this.postDiv) this.postDiv.nativeElement.innerHTML = '';
        this.newPost.emit(response.post);
      },
      error: (error) => console.error('Error', error)
    });
  }
}