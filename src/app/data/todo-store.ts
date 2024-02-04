import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from "@ngrx/signals";
import {Todo} from "./todo";
import {computed, inject} from "@angular/core";
import {TodoService} from "./todo.service";
import {lastValueFrom} from "rxjs";

export const TodoStore = signalStore(
    {providedIn: 'root'},
    withState({
        todos: [] as Todo[],
        loading: false
    }),

    withComputed(({todos} ) => ({
            countTodos: computed(() => todos().length)
        }),
    ),

    withMethods((store) => {
            const todoService = inject(TodoService)
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
