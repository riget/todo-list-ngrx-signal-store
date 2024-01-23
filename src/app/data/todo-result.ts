import {Todo} from "./todo";

export interface TodoResult {
    limit: number;
    skip: number;
    todos: Todo[];
    total: number;
}
