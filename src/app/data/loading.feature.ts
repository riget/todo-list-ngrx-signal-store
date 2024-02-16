import {patchState, signalStoreFeature, withMethods, withState} from "@ngrx/signals";

export function withLoading() {
    return signalStoreFeature(
        withState({loading: false}),

        withMethods((store) => {
            return {
                setLoading () {
                    patchState(store, {loading: true});
                },
                setCompleted () {
                    patchState(store, {loading: false});
                }
            }
        })
    )
}
