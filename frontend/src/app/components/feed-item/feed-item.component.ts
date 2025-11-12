import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FeedService } from '../../services/feed.service';
import { FormsModule } from '@angular/forms';

interface ReactionType {
    type: string;
    name: string;
}

@Component({
    selector: 'app-feed-item',
    imports: [CommonModule, FormsModule],
    templateUrl: './feed-item.component.html',
    styleUrl: './feed-item.component.css'
})
export class FeedItemComponent {
    @Input() userAvatar: string = '';
    @Input() username: string = '';
    @Input() content: string = '';
    @Input() date: string = '';
    @Input() likes: number = 0;
    @Input() comments: number = 0;
    @Input() tags: string[] = [];
    @Input() reactions: string = '';
    @Input() postId: number = 0;
    @Input() userHasReacted: boolean = false;
    @Input() userReactionType: string = '';
    @Input() showComment: boolean = false;
    @Input() commentImage: any = '2';
    @Input() commentUsername: any = '';
    @Input() commentContent: any = '';
    @Input() commentDate: any = '';

    showReactions = false;
    reactionTimer: any;
    showInputComment = false;
    commentInput: string = '';

    availableReactions: ReactionType[] = [
        { type: 'like', name: 'Me gusta' },
        { type: 'love', name: 'Me encanta' },
        { type: 'haha', name: 'Me divierte' },
        { type: 'wow', name: 'Me asombra' },
        { type: 'sad', name: 'Me entristece' },
        { type: 'angry', name: 'Me enfada' },
        { type: 'celebrate', name: 'Me ovaciona' },
        { type: 'beer', name: 'Me brindo' },
    ];

    constructor(private router: Router, private feedService: FeedService) { }

    navigateTo(path: string, event?: Event): void {
        if (event) {
            event.stopPropagation();
        }
        this.router.navigate([path]);
    }

    onReactionLeave(): void {
        this.reactionTimer = setTimeout(() => {
            if (this.showReactions) {
                this.showReactions = false;
            }
        }, 300);
    }

    onReactionPickerEnter(): void {
        this.clearReactionTimer();
        this.showReactions = true;
    }

    clearReactionTimer(): void {
        if (this.reactionTimer) {
            clearTimeout(this.reactionTimer);
        }
    }

    reactToPost(postId: number, type: string): void {
        this.clearReactionTimer();

        this.feedService.reactToAPost(postId, type).subscribe((res: any) => {
            this.likes = res.likes_count;
            this.userHasReacted = res.user_has_reacted;
            this.userReactionType = res.reaction_type || '';
            this.showReactions = false;
        });
    }

    toggleInputComment(): void {
        this.showInputComment = !this.showInputComment;
    }

    onReplySubmit(): void {
        // this.feedService.commentToAPost(this.postId, this.commentInput).subscribe((res: any) => {
        //     this.comments = res.comments_count;
        //     this.showComment = false;
        //     this.commentInput = '';
        //     console.log('Reply submitted', this.commentInput);
        //     console.log('Comments count', res);
        // });

        const content = {
            content: this.commentInput,
            is_public: true,
            meta: null,
            parent_post: this.postId
        }

        this.feedService.postPost(content).subscribe((res: any) => {
            this.comments++;
            this.showComment = false;
            this.commentInput = '';
            console.log('Reply submitted', this.commentInput);
            console.log('Comments count', res);
        });

    }

//       postPost(content: string) {
//     if (!content) return;

//     this.feedService.postPost({
//       content: content,
//       is_public: true,
//       meta: null
//     }).subscribe({
//       next: (response) => {
//         console.log('Post creado exitosamente', response);
//         const textarea = document.querySelector('textarea');
//         if (textarea) textarea.value = '';
//         this.newPost.emit(response.post);
//       },
//       error: (error) => {
//         console.error('Error al crear el post', error);
//       }
//     });
//   }
}
