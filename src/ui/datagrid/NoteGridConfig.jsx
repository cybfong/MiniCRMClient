import { dateTimeValueFormatter } from '../../utils/gridFormatters';

export const noteColumnDefs = [
  // {
  //   field: 'id',
  //   headerName: 'Note Id',
  //   // pinned: 'left',
  // },
  {
    field: 'noteText',
    headerName: 'Note Text',
    // Options specific ONLY to the Name column
    sortable: true,
    // pinned: 'left', // Keep the name locked to the left side
    // checkboxSelection: true, // Show a checkbox next to the name
    // maxWidth: 200,
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    valueFormatter: dateTimeValueFormatter,
  },
  {
    field: 'updatedAt',
    headerName: 'Updated At',
    valueFormatter: dateTimeValueFormatter,
  },
];

// Overall grid settings (like pagination) stay here
export const noteGridOptions = {
  pagination: true,
  paginationPageSize: 10,
  paginationPageSizeSelector: [10, 20, 50, 100],
  defaultColDef: {
    resizable: true,
    sortable: true,
    filter: 'agTextColumnFilter',
  },
  autoSizeStrategy: {
    type: 'fitCellContents',
  },
};
