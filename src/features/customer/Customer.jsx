import { AgGridReact } from 'ag-grid-react';
import { useCallback, useEffect, useState } from 'react';
import { useLoaderData, useOutletContext } from 'react-router-dom';
import {
  customerColumnDefs,
  customerGridOptions,
} from '../../ui/datagrid/CustomerGridConfig';

function Customer() {
  // Pull the setter function from the outlet context
  const { setFooterText } = useOutletContext();

  const [gridApi, setGridApi] = useState(null);

  const customers = useLoaderData();

  const onSelectionChanged = () => {
    const selectedData = gridApi?.getSelectedRows() ?? [];
    if (selectedData.length === 0) return;

    console.log('Customer name:', selectedData[0].customerName);
  };

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
  }, []);

  useEffect(() => {
    setFooterText('Manage customer details');
  }, [setFooterText]);

  return (
    <>
      <div>
        <div className="ag-theme-alpine" style={{ width: '100%' }}>
          <AgGridReact
            rowData={customers}
            columnDefs={customerColumnDefs}
            gridOptions={customerGridOptions}
            domLayout="autoHeight"
            rowSelection="single"
            onSelectionChanged={onSelectionChanged}
            onGridReady={onGridReady}
          />
        </div>
      </div>
    </>
  );
}

export default Customer;
