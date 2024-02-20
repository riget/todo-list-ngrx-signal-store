import {EntityId} from "@ngrx/signals/entities";

export interface TodoItem {
    id: EntityId;
    todo: string;
    completed: boolean;
    userId?: number;
}
