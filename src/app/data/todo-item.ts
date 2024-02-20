import {EntityId} from "@ngrx/signals/entities";

export interface TodoItem {
    id: string;
    todo: string;
    completed: boolean;
    userId?: number;
}
