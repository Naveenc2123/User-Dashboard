/**
 * Loader
 *
 * Full-area centered loading spinner.
 *
 * Props:
 *  message – optional text below the spinner   (default: "Loading…")
 *  fullPage – if true, takes the full viewport height  (default: false)
 *
 * Usage:
 *   if (loading) return <Loader />;
 *   if (loading) return <Loader fullPage message="Fetching users…" />;
 */

const Loader = ({ message = "Loading…", fullPage = false }) => {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center gap-3",
        fullPage ? "min-h-screen" : "py-16",
      ].join(" ")}
    >
      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      {message && (
        <p className="text-sm text-gray-400">{message}</p>
      )}
    </div>
  );
};

export default Loader;
