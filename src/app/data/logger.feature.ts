import {getState, signalStoreFeature, withHooks} from "@ngrx/signals";
import {effect} from "@angular/core";

export function withLogger(name: string) {
    return signalStoreFeature(
        withHooks({
            onInit(store) {
                effect(() => {
                    const state = getState(store);
                    console.log(`${name} state changed`, state);
                });
            },
        })
    );
}
