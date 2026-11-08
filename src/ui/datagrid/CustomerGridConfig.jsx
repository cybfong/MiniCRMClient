import {
  checkCellUpdatedRule,
  dateTimeValueFormatter,
} from '../../utils/gridFormatters';

export const customerColumnDefs = [
  {
    field: 'customerName',
    headerName: 'Customer Name',
    editable: true,
    cellClassRules: checkCellUpdatedRule,
  },
  {
    field: 'industry',
    headerName: 'Industry',
    editable: true,
    cellClassRules: checkCellUpdatedRule,
  },
  {
    field: 'website',
    headerName: 'Website',
    editable: true,
    cellClassRules: checkCellUpdatedRule,
  },
  {
    field: 'phone',
    headerName: 'Phone',
    editable: true,
    cellClassRules: checkCellUpdatedRule,
  },
  {
    field: 'email',
    headerName: 'Email',
    editable: true,
    cellClassRules: checkCellUpdatedRule,
  },
  {
    field: 'address',
    headerName: 'Address',
    editable: true,
    cellClassRules: checkCellUpdatedRule,
  },
  {
    field: 'city',
    headerName: 'City',
    editable: true,
    cellClassRules: checkCellUpdatedRule,
  },
  {
    field: 'country',
    headerName: 'Country',
    editable: true,
    cellClassRules: checkCellUpdatedRule,
  },
  {
    field: 'status',
    headerName: 'Status',
    editable: true,
    cellClassRules: checkCellUpdatedRule,
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    valueFormatter: dateTimeValueFormatter,
    editable: false,
  },
  {
    field: 'updatedAt',
    headerName: 'Updated At',
    valueFormatter: dateTimeValueFormatter,
    editable: false,
  },
  {
    field: 'createdBy',
    headerName: 'Created By',
    editable: false,
  },
  {
    field: 'updatedBy',
    headerName: 'Updated By',
    editable: false,
  },
];

export const rowSelection = {
  mode: 'multiRow', // Enables checkboxes on rows
  checkboxes: true,
  headerCheckbox: true, // Enables the header "Select All" checkbox
  enableClickSelection: false,
  selectAll: 'currentPage', // Optional: 'all', 'filtered', or 'currentPage'
};

// Overall grid settings (like pagination) stay here
export const customerGridOptions = {
  // pagination: true,
  // paginationPageSize: 10,
  // paginationPageSizeSelector: [10, 20, 50, 100],
  defaultColDef: {
    resizable: true,
    sortable: true,
    filter: 'agTextColumnFilter',
  },
  autoSizeStrategy: {
    type: 'fitCellContents',
  },
};

export const selectionColumnDef = {
  width: 50,
  resizable: false,
  sortable: false,
  suppressHeaderMenuButton: true,

  cellClass: 'customer-delete-selection-cell',
};
