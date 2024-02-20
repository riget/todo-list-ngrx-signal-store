import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from "@ngrx/signals";
import {TodoItem} from "./todo-item";
import {computed, inject} from "@angular/core";
import {TodoService} from "./todo.service";
import {lastValueFrom} from "rxjs";
import {withLogger} from "./logger.feature";
import {withLoading} from "./loading.feature";

export const TodoStore = signalStore(
    {providedIn: 'root'},
    withState({
        todos: [] as TodoItem[]
    }),

    withComputed(({todos} ) => ({
            countTodos: computed(() => todos().length)
        }),
    ),

    withLoading(),

    withMethods((store) => {
            const todoService = inject(TodoService)

            return {
                async loadAllTodos() {
                    store.setLoading();
                    const todoResult = await todoService.getItems();
                    patchState(store, {todos: todoResult.todos});
                    store.setCompleted();
                },

                async addTodo(todoText: string) {
                    store.setLoading();
                    const newTodo = await todoService.addItem(todoText);
                    patchState(store, {
                            todos: [...store.todos(), newTodo]
                    });
                    store.setCompleted();
                }
            }
        }
    ),

    withLogger('todos'),

    withHooks({
        onInit({loadAllTodos}) {
            loadAllTodos();
        },
        onDestroy() {
            console.log('on destroy');
        },
    })
);
