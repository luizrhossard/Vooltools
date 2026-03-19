import { useEffect } from 'react';

interface ToastProps {
    message: string;
    visible: boolean;
    onHide: () => void;
}

export function Toast({ message, visible, onHide }: ToastProps) {
    useEffect(() => {
        if (!visible) return;
        const t = window.setTimeout(onHide, 3800);
        return () => window.clearTimeout(t);
    }, [visible, onHide]);

    return (
        <div className={`toast ${visible ? 'show' : ''}`}>
            <i className="fas fa-check-circle"></i>
            <span>{message}</span>
        </div>
    );
}