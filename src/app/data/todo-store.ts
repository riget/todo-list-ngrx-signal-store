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
                loadAllTodos() {
                    store.setLoading();
                    lastValueFrom(todoService.getItems()).then(todoResult => {
                        patchState(store, {todos: todoResult.todos});
                        store.setCompleted();
                    })
                },

                addTodo(todoText: string) {
                    patchState(store, {loading: true});
                    lastValueFrom(todoService.addItem(todoText)).then((newTodo: TodoItem) => {
                        patchState(store, {
                            todos: [...store.todos(), newTodo]
                        });
                        patchState(store, {loading: false});
                    });
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
