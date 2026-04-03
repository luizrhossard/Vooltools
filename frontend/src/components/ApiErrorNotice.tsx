interface ApiErrorNoticeProps {
  message: string;
  onRetry?: () => void;
}

export function ApiErrorNotice({ message, onRetry }: ApiErrorNoticeProps) {
  return (
    <div
      role="alert"
      style={{
        border: '1px solid #e0b4b4',
        background: '#fff6f6',
        color: '#9f3a38',
        borderRadius: '8px',
        padding: '12px 14px',
        marginBottom: '16px',
      }}
    >
      <p style={{ margin: 0 }}>{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="btn-secondary"
          style={{ marginTop: '10px' }}
        >
          Tentar novamente
        </button>
      ) : null}
    </div>
  );
}

