import { createSelector, createSlice } from '@reduxjs/toolkit';

const initialState = {
  initialRowData: [],
  currentRowData: [],
};

// List out the specific fields in a row that are editable
const EDITABLE_FIELDS = [
  'customerName',
  'industry',
  'website',
  'phone',
  'email',
  'address',
  'city',
  'country',
  'status',
];

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setInitialData(state, action) {
      state.initialRowData = action.payload;
      state.currentRowData = JSON.parse(JSON.stringify(action.payload));
    },
    updateRow: (state, action) => {
      const { id, field, newValue } = action.payload;
      // console.log(id, field, newValue);

      // 1. Find the current and initial rows
      const currentRow = state.currentRowData.find((row) => row.id === id);
      const initialRow = state.initialRowData.find((row) => row.id === id);

      if (!currentRow || !initialRow) return;

      // 2. Apply the new value to the current row first
      currentRow[field] = newValue;

      // 3. Scan ALL editable fields to see if ANY of them differ from initial data
      const hasAnyChanges = EDITABLE_FIELDS.some(
        (f) => currentRow[f] !== initialRow[f],
      );

      // 4. Update the currentRow's "updated" flag (only) based on the clean scan result
      currentRow.updated = hasAnyChanges;
    },
  },
});

export const { setInitialData, updateRow } = customerSlice.actions;

export default customerSlice.reducer;

// --- Selectors ---
// 1. Input selector to get the raw data safely
const selectCurrentRowData = (state) => state?.customer?.currentRowData;

// 2. Memoized selector using createSelector
export const getUpdatedRows = createSelector(
  [selectCurrentRowData],
  (currentRowData) => {
    if (!currentRowData) return []; // Return a stable empty array reference or 0 if you strictly need a count
    return currentRowData.filter((row) => row.updated === true);
  },
);
