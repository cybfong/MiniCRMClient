export const customerColumnDefs = [
  {
    field: 'id',
    headerName: 'Customer Id',
    // pinned: 'left',
  },
  {
    field: 'customerName',
    headerName: 'Customer Name',
    // Options specific ONLY to the Name column
    sortable: true,
    // pinned: 'left', // Keep the name locked to the left side
    // checkboxSelection: true, // Show a checkbox next to the name
    // maxWidth: 200,
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
    field: 'website',
    headerName: 'Website',
  },
  {
    field: 'industry',
    headerName: 'Industry',
  },
  {
    field: 'address',
    headerName: 'Address',
  },
  {
    field: 'city',
    headerName: 'City',
  },
  {
    field: 'country',
    headerName: 'Country',
  },
  // {
  //   headerName: 'Notes',
  //   valueGetter: (params) => params.data.notes?.[0]?.noteText ?? '',
  // },
  {
    field: 'status',
    headerName: 'Status',
  },
];

// Overall grid settings (like pagination) stay here
export const customerGridOptions = {
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
