import { useState, useRef, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function PinInput({ pin, onChange, onKeyDown, loading, autoFocusIndex = 0 }: {
  pin: string[];
  onChange: (_index: number, _value: string) => void;
  onKeyDown: (_index: number, _e: KeyboardEvent<HTMLInputElement>) => void;
  loading: boolean;
  autoFocusIndex?: number;
}) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  return (
    <div className="flex justify-center gap-3">
      {pin.map((_digit, index) => (
        <input
          key={index}
          ref={(el) => { inputsRef.current[index] = el; }}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={pin[index]}
          onChange={(e) => onChange(index, e.target.value)}
          onKeyDown={(e) => onKeyDown(index, e)}
          disabled={loading}
          autoFocus={index === autoFocusIndex}
          className="w-16 h-16 text-center text-2xl font-bold rounded-xl border-2 border-neutral-700 bg-neutral-800 text-white focus:border-primary-500 focus:outline-none transition-colors"
        />
      ))}
    </div>
  );
}

function SubmitButton({ loading, disabled, children }: {
  loading: boolean;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="w-full py-3.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? "Verificando..." : children}
    </button>
  );
}

export default function LoginPage() {
  const { loginPin } = useAuth();
  const navigate = useNavigate();
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const fullPin = pin.join("");
    if (fullPin.length !== 4) return;

    setLoading(true);
    setError("");
    try {
      await loginPin(fullPin);
      navigate("/");
    } catch {
      setError("PIN incorrecto");
      setPin(["", "", "", ""]);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      // Focus handled by PinInput via autoFocus
    }

    if (newPin.every((d) => d !== "") && index === 3) {
      setTimeout(() => handleSubmit(), 100);
    }
  }

  function handleKeyDown(_index: number, _e: KeyboardEvent<HTMLInputElement>) {
    // Focus handled by PinInput
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900">
      <div className="w-full max-w-sm mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-600 mb-6">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Library System</h1>
          <p className="text-neutral-400">Ingrese su PIN para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <PinInput pin={pin} onChange={handleChange} onKeyDown={handleKeyDown} loading={loading} />
          {error && <p className="text-center text-danger-500 text-sm font-medium">{error}</p>}
          <SubmitButton loading={loading} disabled={pin.join("").length !== 4}>Ingresar</SubmitButton>
        </form>
      </div>
    </div>
  );
}