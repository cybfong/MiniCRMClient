function ChangeBadge({ label, count = 0, type = 'add' }) {
  const base =
    'inline-block items-center rounded-full px-4 py-2 text-sm font-semibold tracking-wide uppercase';

  const colorStyles =
    count === 0
      ? 'bg-gray-500 text-stone-300'
      : {
          add: 'bg-emerald-600 text-white',
          update: 'bg-amber-600 text-white',
          delete: 'bg-red-600 text-white',
        }[type];

  return (
    <span className={`${base} ${colorStyles}`}>
      {`${label} ${count > 0 ? '[' + count + ']' : ''}`}
    </span>
  );
}

export default ChangeBadge;
