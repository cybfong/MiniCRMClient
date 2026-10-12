function Loader({ isLoading }) {
  if (!isLoading) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 z-9999 flex items-center justify-center bg-slate-700/40 backdrop-blur-sm"
      role="status"
      aria-label="Loading"
    >
      <div className="loader" />
    </div>
  );
}

export default Loader;
