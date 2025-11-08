interface LocationConsentModalProps {
  isOpen: boolean;
  onConsent: () => void;
  onDecline: () => void;
}

export default function LocationConsentModal({
  isOpen,
  onConsent,
  onDecline
}: LocationConsentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-6">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-blue-500 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-blue-500/30">
        <h2 className="text-2xl font-bold text-white mb-4">
          Location Access Required
        </h2>
        <p className="text-gray-300 mb-6 leading-relaxed">
          RES-Q needs access to your approximate location to provide accurate,
          region-specific emergency assistance and safety updates. Your exact
          location is never stored or shared.
        </p>

        <div className="flex gap-4">
          <button
            onClick={onConsent}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105"
          >
            I Consent
          </button>
          <button
            onClick={onDecline}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
