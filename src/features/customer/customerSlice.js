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

const normalizeCustomerRecord = (
  customer,
  { contactIds = [], noteIds = [] } = {},
) => ({
  id: customer.id,
  customerName: customer.customerName,
  industry: customer.industry,
  website: customer.website,
  phone: customer.phone,
  email: customer.email,
  address: customer.address,
  city: customer.city,
  country: customer.country,
  status: customer.status,
  // createdAt, createdBy, updatedAt, updatedBy are all managed by server process, using the JWT token information
  createdAt: customer.createdAt,
  updatedAt: customer.updatedAt,
  createdBy: customer.createdBy?.fullName ?? customer.createdBy ?? '',
  updatedBy: customer.updatedBy?.fullName ?? customer.updatedBy ?? '',
  // updated, isNew, deleted will be false after adding and update operations.
  updated: false,
  isNew: false,
  deleted: false,
  contactIds: customer.contactIds ?? contactIds,
  noteIds: customer.noteIds ?? noteIds,
});

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
      currentRow.deleted = false; // avoid multiple actions (delete + update not allowed)

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

      const now = new Date().toLocaleString('sv-SE');
      const fullName = action.payload;

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
        createdBy: fullName,
        updatedBy: fullName,
        contactIds: [],
        noteIds: [],
      });
    },
    setRowsMarkedForDelete: (state, action) => {
      const selectedIds = new Set(action.payload);

      state.currentRowData.forEach((row) => {
        // if (!row.isNew) {
        row.deleted = selectedIds.has(row.id);
        // }
      });
    },
    updateCustomerStateData: (state, action) => {
      const { savedCustomer, rowId, isNew, isUpdated, isDeleted } =
        action.payload;
      console.log(
        '>> updateCustomerStateData [savedCustomer, rowId, isNew, isUpdated, isDeleted] : ',
        savedCustomer,
        rowId,
        isNew,
        isUpdated,
        isDeleted,
      );

      // 0. Handle delete first so we remove instead of replacing
      if (isDeleted === true) {
        const deletedId = savedCustomer?.id ?? rowId;
        state.currentRowData = state.currentRowData.filter(
          (row) => row.id !== rowId && row.id !== deletedId,
        );
        state.initialRowData = state.initialRowData.filter(
          (row) => row.id !== rowId && row.id !== deletedId,
        );
        return;
      }

      // 1. Locate the row in currentRowData
      const currentIdx = state.currentRowData.findIndex(
        (row) => row.id === rowId,
      );
      if (currentIdx === -1) {
        return;
      }

      // 2. Prepare data to update currentRowData and perform update
      const existingRow = state.currentRowData[currentIdx];

      // 2. Normalize and update currentRowData
      const processedCustomer = normalizeCustomerRecord(savedCustomer, {
        contactIds: savedCustomer?.contactIds ?? existingRow?.contactIds ?? [],
        noteIds: savedCustomer?.noteIds ?? existingRow?.noteIds ?? [],
      });

      state.currentRowData[currentIdx] = processedCustomer;

      // 3. Update initialRowData
      if (isNew === true) {
        // Just copy NEW Customer to initialRowData
        state.initialRowData.push({ ...processedCustomer });
      } else if (isUpdated === true) {
        // Find Customer for update or delete
        const initialIdx = state.initialRowData.findIndex(
          (row) => row.id === processedCustomer.id,
        );
        if (initialIdx !== -1) {
          state.initialRowData[initialIdx] = { ...processedCustomer };
        } else {
          // Is that evn possible ?
          console.error(
            `InitialRowData not found for Customer Id : ${processedCustomer.id}`,
          );
        }
      }
    },
  },
});

export const {
  setInitialData,
  updateRow,
  addRow,
  setRowsMarkedForDelete,
  updateCustomerStateData,
} = customerSlice.actions;

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
