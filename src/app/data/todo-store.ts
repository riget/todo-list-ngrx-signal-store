import {patchState, signalStore, type, withComputed, withHooks, withMethods, withState} from "@ngrx/signals";
import {TodoItem} from "./todo-item";
import {computed, inject} from "@angular/core";
import {TodoService} from "./todo.service";
import {lastValueFrom} from "rxjs";
import {withLogger} from "./logger.feature";
import {withLoading} from "./loading.feature";
import {addEntities, addEntity, setEntities, updateEntity, withEntities} from "@ngrx/signals/entities";


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
                    todoService.getItems().subscribe(todoResult => {
                        patchState(store, setEntities(todoResult.todos));
                        store.setCompleted();
                    })
                },

                addTodo(todoText: string) {
                    store.setLoading()
                    todoService.addItem(todoText).subscribe((newTodo: TodoItem) => {
                        patchState(store, addEntity(newTodo));
                        store.setCompleted();
                    });
                },

                updateTodo(id: string, todoText: string) {

                    patchState(store, updateEntity({id, changes: {todo: todoText}}));
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
