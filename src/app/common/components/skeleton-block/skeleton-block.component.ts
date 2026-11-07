import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton-block',
  standalone: true,
  template: `<div class="sk" [style.height]="height()" [style.width]="width()"></div>`,
  styles: `
    .sk {
      border-radius: 6px;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.05),
        rgba(255, 255, 255, 0.12),
        rgba(255, 255, 255, 0.05)
      );
      background-size: 200% 100%;
      animation: sk-shimmer 1.4s infinite;
    }
    @keyframes sk-shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonBlockComponent {
  readonly height = input('1rem');
  readonly width = input('100%');
}
