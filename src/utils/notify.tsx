import React from "react";
import toast from "react-hot-toast";

export type NotifyId = string;

export type NotifyOptions = {
    id?: NotifyId;
    linkUrl?: string;
    linkLabel?: string;
    duration?: number;
};

export const notify = {
    loading(message: string, opts?: NotifyOptions): NotifyId {
        const id = opts?.id ?? undefined;
        const toastId = toast.loading(message, {
            id,
            duration: opts?.duration,
        });
        return toastId as string;
    },

    success(message: string, opts?: NotifyOptions): NotifyId {
        const content: string | React.ReactElement = linkable(message, opts);
        const toastId = toast.success(content, {
            id: opts?.id,
            duration: opts?.duration,
        });
        return (toastId as string) ?? "";
    },

    error(message: string, opts?: NotifyOptions): NotifyId {
        const content: string | React.ReactElement = linkable(message, opts);
        const toastId = toast.error(content, {
            id: opts?.id,
            duration: opts?.duration,
        });
        return (toastId as string) ?? "";
    },

    resolveSuccess(id: NotifyId, message: string, opts?: NotifyOptions) {
        const content: string | React.ReactElement = linkable(message, opts);
        toast.success(content, { id, duration: opts?.duration });
    },

    resolveError(id: NotifyId, message: string, opts?: NotifyOptions) {
        const content: string | React.ReactElement = linkable(message, opts);
        toast.error(content, { id, duration: opts?.duration });
    },

    dismiss(id?: NotifyId) {
        if (id) toast.dismiss(id);
        else toast.dismiss();
    },
};

function linkable(
    message: string,
    opts?: NotifyOptions
): string | React.ReactElement {
    if (!opts?.linkUrl) return message;
    return (
        <div className="flex items-center gap-2">
            <span>{message}</span>
            <a
                href={opts.linkUrl}
                target="_blank"
                rel="noreferrer"
                className="underline text-[#94ff0b] hover:opacity-80"
            >
                {opts.linkLabel ?? "View"}
            </a>
        </div>
    );
}
