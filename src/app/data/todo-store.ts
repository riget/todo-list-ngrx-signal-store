import {patchState, signalStore, withHooks, withMethods, withState} from "@ngrx/signals";
import {Todo} from "./todo";
import {inject} from "@angular/core";
import {TodoService} from "./todo.service";
import {lastValueFrom} from "rxjs";

export const TodoStore = signalStore(
    {providedIn: 'root'},
    withState({
        todos: [] as Todo[],
        loading: false
    }),

    withMethods((store, todoService = inject(TodoService)) => {
            const setLoading = () => {
                patchState(store, {loading: true});
            };
            const setCompleted = () => {
                patchState(store, {loading: false});
            }

            return {
                loadAllTodos() {
                    setLoading();
                    lastValueFrom(todoService.getItems()).then(todoResult => {
                        patchState(store, {todos: todoResult.todos});
                        setCompleted();
                    })
                },

                addTodo(todoText: string) {
                    patchState(store, {loading: true});
                    lastValueFrom(todoService.addItem(todoText)).then((newTodo: Todo) => {
                        patchState(store, {
                            todos: [...store.todos(), newTodo]
                        });
                        patchState(store, {loading: false});
                    });
                }
            }
        }
    ),

    withHooks({
        onInit({loadAllTodos}) {
            loadAllTodos();
        },
        onDestroy() {
            console.log('on destroy');
        },
    })
);
