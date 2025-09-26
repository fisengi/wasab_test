import * as React from "react";

function useMediaQuery(query: string) {
    const subscribe = React.useCallback(
        (cb: () => void) => {
            const mql = window.matchMedia(query);
            mql.addEventListener?.("change", cb);
            return () => mql.removeEventListener?.("change", cb);
        },
        [query]
    );

    const getSnapshot = React.useCallback(
        () =>
            typeof window !== "undefined"
                ? window.matchMedia(query).matches
                : false,
        [query]
    );

    return React.useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export function useIsMobile(breakpointPx = 640) {
    return useMediaQuery(`(max-width: ${breakpointPx}px)`);
}
