import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TodoItem} from "./todo-item";
import {TodoResult} from "./todo-result";

const apiUrl = `https://dummyjson.com/todos`;

@Injectable({
  providedIn: 'root'
})
export class TodoService {

    private readonly http = inject(HttpClient);

    private url = `${apiUrl}`;
    private userId = 25;

    public getItems(): Observable<TodoResult> {
        return this.http.get<TodoResult>(this.url + `/user/${this.userId}?limit=0`);
    }

    public addItem(todoText: string): Observable<TodoItem> {
        const todo: TodoItem = {
            todo: todoText,
            userId: this.userId,
            completed: false
        }

        return this.http.post<TodoItem>(this.url + '/add', todo);
    }
}
