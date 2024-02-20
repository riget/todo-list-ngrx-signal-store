import {patchState, signalStore, type, withComputed, withHooks, withMethods, withState} from "@ngrx/signals";
import {TodoItem} from "./todo-item";
import {computed, inject} from "@angular/core";
import {TodoService} from "./todo.service";
import {lastValueFrom} from "rxjs";
import {withLogger} from "./logger.feature";
import {withLoading} from "./loading.feature";
import {addEntities, addEntity, setEntities, withEntities} from "@ngrx/signals/entities";

export const TodoStore = signalStore(
    {providedIn: 'root'},
    withEntities<TodoItem>(),

    withComputed(({entities} ) => ({
            countTodos: computed(() => entities().length)
        }),
    ),

    withLoading(),

    withMethods((store) => {
            const todoService = inject(TodoService)

            return {
                loadAllTodos() {
                    store.setLoading();
                    lastValueFrom(todoService.getItems()).then(todoResult => {
                        patchState(store, setEntities(todoResult.todos));
                        store.setCompleted();
                    })
                },

                addTodo(todoText: string) {
                    store.setLoading()
                    lastValueFrom(todoService.addItem(todoText)).then((newTodo: TodoItem) => {
                        console.log('newtodo: ', newTodo);
                        patchState(store, addEntity(newTodo));
                        store.setCompleted();
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
