export function getMarketNameFromUrl(): string | null {
    try {
        const url = new URL(String(window.location));
        const name = url.searchParams.get("market");
        return name && name.trim().length > 0 ? name : null;
    } catch {
        return null;
    }
}

export function setMarketNameInUrl(
    marketName: string,
    replace: boolean = false
): void {
    const url = new URL(String(window.location));
    const searchParams = url.searchParams;
    if (marketName && marketName.trim().length > 0) {
        searchParams.set("market", String(marketName));
    } else {
        searchParams.delete("market");
    }
    url.search = searchParams.toString();
    if (replace) {
        history.replaceState({ marketName }, "", url);
    } else {
        history.pushState({ marketName }, "", url);
    }
}

export function subscribeToMarketInUrlChange(
    listener: (marketName: string | null) => void
): () => void {
    const handler = () => {
        listener(getMarketNameFromUrl());
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
}
