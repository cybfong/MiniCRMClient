import { createSelector, createSlice } from '@reduxjs/toolkit';

const initialState = {
  initialRowData: [],
  currentRowData: [],
};

// List out the specific fields in a row that are editable
export const EDITABLE_FIELDS = [
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

      const currentRow = state.currentRowData.find((row) => row.id === id);
      if (!currentRow) return;

      // If it's a brand new row, just update the value
      if (currentRow.isNew) {
        currentRow[field] = newValue;
        return;
      }

      // Otherwise, handle regular server-fetched rows normally
      const initialRow = state.initialRowData.find((row) => row.id === id);
      if (!initialRow) return;

      // 2. Apply the new value to the current row first
      currentRow[field] = newValue;

      // 3. Scan ALL editable fields to see if ANY of them differ from initial data
      const hasAnyChanges = EDITABLE_FIELDS.some(
        (f) => currentRow[f] !== initialRow[f],
      );

      // 4. Update the currentRow's "updated" flag (only) based on the clean scan result
      currentRow.updated = hasAnyChanges;
    },
    addRow: (state, action) => {
      // 1. Prevent adding if an uncompleted new row already exists
      const hasIncompleteNewRow = state.currentRowData.some(
        (row) =>
          row.isNew &&
          EDITABLE_FIELDS.some(
            (field) => !row[field] || String(row[field]).trim() === '',
          ),
      );
      if (hasIncompleteNewRow) return;

      const now = new Date().toISOString();
      const { userId, fullName } = action.payload;

      state.currentRowData.push({
        id: 'temp-' + Date.now(), // Crucial: Unique ID for getRowId
        customerName: '',
        industry: '',
        website: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        country: '',
        status: 'ACTIVE',
        isNew: true, // The flag that tells AG-Grid to visually sort this to the top
        updated: false, // Automatically track it as modified/new for saving
        deleted: false,
        createdAt: now,
        updatedAt: now,
        createdBy: fullName, // For diaplay
        updatedBy: fullName, // For diaplay
        createdByUserId: userId, // For database table update
        updatedByUserId: userId, // For database table update
      });
    },
  },
});

export const { setInitialData, updateRow, addRow } = customerSlice.actions;

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

export const getNewRows = createSelector(
  [selectCurrentRowData],
  (currentRowData) => {
    if (!currentRowData) return []; // Return a stable empty array reference or 0 if you strictly need a count
    return currentRowData.filter((row) => row.isNew === true);
  },
);
