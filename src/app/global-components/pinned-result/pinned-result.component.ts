import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Todo } from 'src/app/interfaces/todo';

@Component({
  selector: 'app-pinned-result',
  templateUrl: './pinned-result.component.html',
  styleUrls: ['./pinned-result.component.scss'],
})
export class PinnedResultComponent {
  @Input() todos: any;
  @Output() delete = new EventEmitter();
  constructor(private cdr: ChangeDetectorRef) {}

  dismissTodo(todoId) {
    const t = this.todos.findIndex((todo: Todo) => todo.id === todoId)
    this.todos[t].hidden = true
    this.cdr.detectChanges()
    setTimeout(() => {
      this.delete.emit(todoId);
    }, 200);
  }
}
