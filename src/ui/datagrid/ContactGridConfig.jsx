import { dateTimeValueFormatter } from '../../utils/gridFormatters';

export const contactColumnDefs = [
  // {
  //   field: 'id',
  //   headerName: 'Contact Id',
  //   // pinned: 'left',
  // },
  {
    field: 'firstName',
    headerName: 'First Name',
    // Options specific ONLY to the Name column
    sortable: true,
    // pinned: 'left', // Keep the name locked to the left side
    // checkboxSelection: true, // Show a checkbox next to the name
    // maxWidth: 200,
  },
  {
    field: 'lastName',
    headerName: 'Last Name',
  },
  {
    field: 'email',
    headerName: 'Email',
  },
  {
    field: 'phone',
    headerName: 'Phone',
    editable: true,
  },
  {
    field: 'jobTitle',
    headerName: 'Job Title',
  },
  // {
  //   field: 'deleted',
  //   headerName: 'Deleted',
  // },
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
export const contactGridOptions = {
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
