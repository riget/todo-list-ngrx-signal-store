import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TodoStore} from "../data/todo-store";
import {NgForOf, NgIf} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
    selector: 'app-todo-list',
    standalone: true,
    imports: [
        NgForOf,
        NgIf,
        ReactiveFormsModule
    ],
    templateUrl: './todo-list.component.html',
    styleUrl: './todo-list.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent {

    public readonly store = inject(TodoStore);

    private readonly formbuilder = inject(FormBuilder);

    public form = this.formbuilder.group({
        todoText: ['', Validators.required]
    });

    public onAddTodo() {
        this.store.addTodo(this.form.value.todoText ?? '');
        this.form.reset();
    }
}
