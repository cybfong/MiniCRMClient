function Footer({ message }) {
  return (
    <footer className="flex items-center justify-between border-t border-slate-400 bg-gray-500 px-4 py-3 sm:px-6">
      <span className="text-lg font-semibold text-stone-200">{message}</span>
    </footer>
  );
}

export default Footer;
