export const dateTimeValueFormatter = (params) => {
  const { value } = params;

  if (!value) return '';

  // Expected format: 2026-08-23T17:14:05.575276
  const match = String(value).match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/,
  );

  if (!match) return String(value);

  const [, year, month, day, hour, minute, second] = match;

  return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
};

// 1. Define the rule using Tailwind classes as keys (cellClassRules)
export const checkCellUpdatedRule = {
  // Use Tailwind utility classes directly in the key:
  '!text-red-600 !font-bold !text-xl': (params) => {
    if (!params.data) return false;

    // Access initialRowData via the AG Grid context object
    const initialRow = params.context.initialRowData.find(
      (row) => row.id === params.data.id,
    );

    if (!initialRow) return false;

    // IF THIS RETURNS TRUE: AG Grid adds 'text-red-600 font-bold text-xl' to the cell
    const fieldName = params.colDef.field;
    return params.data[fieldName] !== initialRow[fieldName];
  },
};
