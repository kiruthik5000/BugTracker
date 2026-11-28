import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

const Dropdown = ({
    options = [],
    value,
    onChange,
    placeholder = "Select...",
    searchable = false,
    renderOption,
    className = "",
    disabled = false,
}) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const ref = useRef(null);
    const panelRef = useRef(null);
    const searchRef = useRef(null);

    const updatePosition = useCallback(() => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setCoords({
            top: rect.bottom + 6,
            left: rect.left,
            width: Math.max(rect.width, 180),
        });
    }, []);

    // Close on click outside (check both trigger and portaled panel)
    useEffect(() => {
        const handler = (e) => {
            const inTrigger = ref.current && ref.current.contains(e.target);
            const inPanel = panelRef.current && panelRef.current.contains(e.target);
            if (!inTrigger && !inPanel) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Keep portaled panel aligned on scroll/resize
    useEffect(() => {
        if (!open) return;
        updatePosition();
        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);
        return () => {
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, [open, updatePosition]);

    // Focus search on open
    useEffect(() => {
        if (open && searchable && searchRef.current) {
            searchRef.current.focus();
        }
    }, [open, searchable]);

    const filtered = options.filter((opt) => {
        if (!search) return true;
        const label = typeof opt === "string" ? opt : opt.label || "";
        return label.toLowerCase().includes(search.toLowerCase());
    });

    const selectedOption = options.find((opt) => {
        const val = typeof opt === "string" ? opt : opt.value;
        return val === value;
    });

    const selectedLabel = selectedOption
        ? typeof selectedOption === "string"
            ? selectedOption
            : selectedOption.label
        : null;

    const handleSelect = (opt) => {
        const val = typeof opt === "string" ? opt : opt.value;
        onChange(val);
        setOpen(false);
        setSearch("");
    };

    return (
        <div ref={ref} className={`relative ${className}`}>
            {/* Trigger */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((o) => !o)}
                className={`flex w-full items-center justify-between rounded-xl border bg-white px-4 py-2.5 text-sm shadow-sm transition
                    ${open
                        ? "border-blue-300 ring-2 ring-blue-100"
                        : "border-gray-200 hover:border-gray-300"
                    }
                    ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                `}
            >
                <span className={selectedLabel ? "text-gray-800" : "text-gray-400"}>
                    {selectedLabel || placeholder}
                </span>
                <svg
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown panel */}
            {open &&
                createPortal(
                    <div
                        ref={panelRef}
                        className="fixed z-[9999] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl animate-dropdown-open"
                        style={{
                            top: coords.top,
                            left: coords.left,
                            minWidth: coords.width,
                            transformOrigin: "top center",
                        }}
                    >
                        {/* Search */}
                        {searchable && (
                            <div className="border-b border-gray-100 p-2">
                                <input
                                    ref={searchRef}
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-100"
                                />
                            </div>
                        )}

                        {/* Options */}
                        <div className="max-h-52 overflow-y-auto py-1">
                            {filtered.length === 0 ? (
                                <p className="px-4 py-3 text-center text-sm text-gray-400">No options found</p>
                            ) : (
                                filtered.map((opt, i) => {
                                    const optValue = typeof opt === "string" ? opt : opt.value;
                                    const optLabel = typeof opt === "string" ? opt : opt.label;
                                    const isSelected = optValue === value;

                                    return (
                                        <button
                                            key={optValue || i}
                                            type="button"
                                            onClick={() => handleSelect(opt)}
                                            className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition
                                                ${isSelected
                                                    ? "bg-blue-50 font-medium text-blue-700"
                                                    : "text-gray-700 hover:bg-gray-50"
                                                }
                                            `}
                                        >
                                            {renderOption ? (
                                                renderOption(opt, isSelected)
                                            ) : (
                                                <>
                                                    {opt.color && (
                                                        <span className={`inline-block h-2 w-2 rounded-full ${opt.color}`} />
                                                    )}
                                                    {opt.badge ? (
                                                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${opt.badge}`}>
                                                            {optLabel}
                                                        </span>
                                                    ) : (
                                                        <span>{optLabel}</span>
                                                    )}
                                                    {isSelected && (
                                                        <svg className="ml-auto h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </>
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default Dropdown;
