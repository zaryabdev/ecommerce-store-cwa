"use client";

import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { Fragment } from "react";

import IconButton from "@/components/ui/icon-button";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;

    /** Optional modal title */
    title?: string;

    /** Optional: adjust max width */
    maxWidthClassName?: string; // default "max-w-3xl"
}

const Modal: React.FC<ModalProps> = ({
    open,
    onClose,
    children,
    title,
    maxWidthClassName = "max-w-3xl",
}) => {
    return (
        <Transition show={open} appear as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Overlay */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50" />
                </Transition.Child>

                {/* Panel wrapper */}
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-full p-4 sm:p-6">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 translate-y-2 scale-[0.98]"
                            enterTo="opacity-100 translate-y-0 scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0 scale-100"
                            leaveTo="opacity-0 translate-y-2 scale-[0.98]"
                        >
                            <Dialog.Panel
                                className={[
                                    "w-full",
                                    maxWidthClassName,
                                    "overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5",
                                ].join(" ")}
                            >
                                <div className="relative p-5 sm:p-6">
                                    {/* Close */}
                                    <div className="absolute right-3 top-3 sm:right-4 sm:top-4">
                                        <IconButton
                                            onClick={onClose}
                                            icon={<X size={16} />}
                                        />
                                    </div>

                                    {/* Title */}
                                    {title ? (
                                        <Dialog.Title className="pr-10 text-base font-semibold text-gray-900 sm:text-lg">
                                            {title}
                                        </Dialog.Title>
                                    ) : null}

                                    {/* Content */}
                                    <div className={title ? "mt-4" : ""}>
                                        {children}
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Modal;
