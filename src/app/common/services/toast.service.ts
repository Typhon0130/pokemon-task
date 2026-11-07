import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  text: string;
  kind: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  readonly messages = signal<ToastMessage[]>([]);

  /**
   * Shows a short-lived toast notification.
   */
  show(text: string, kind: ToastMessage['kind'] = 'success'): void {
    const id = this.nextId++;
    this.messages.update((list) => [...list, { id, text, kind }]);
    window.setTimeout(() => this.dismiss(id), 3200);
  }

  dismiss(id: number): void {
    this.messages.update((list) => list.filter((m) => m.id !== id));
  }
}
