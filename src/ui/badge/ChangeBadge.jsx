function ChangeBadge({ label, count = 0, type = 'add' }) {
  const base =
    'inline-block items-center rounded-full px-4 py-2 text-sm font-semibold tracking-wide uppercase';

  const colorStyles =
    count === 0
      ? 'bg-gray-500 text-stone-300'
      : {
          add: 'bg-green-600 text-white',
          update: 'bg-amber-600 text-white',
          delete: 'bg-red-600 text-white',
        }[type];

  return (
    <div className={`${base} ${colorStyles} relative`}>
      {label}
      {count > 0 && (
        <span className="text-l absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-semibold text-stone-100 shadow">
          {count}
        </span>
      )}
    </div>
  );
}

export default ChangeBadge;
