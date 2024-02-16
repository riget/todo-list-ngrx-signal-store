import {TodoItem} from "./todo-item";

export interface TodoResult {
    limit: number;
    skip: number;
    todos: TodoItem[];
    total: number;
}
