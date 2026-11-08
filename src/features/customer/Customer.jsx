import { AgGridReact } from 'ag-grid-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFetcher, useLoaderData, useOutletContext } from 'react-router-dom';
import {
  customerColumnDefs,
  customerGridOptions,
  rowSelection,
  selectionColumnDef,
} from '../../ui/datagrid/CustomerGridConfig';
import Contact from '../contact/Contact';
import Note from '../note/Note';
import { useDispatch, useSelector } from 'react-redux';
import ChangeBadge from '../../ui/badge/ChangeBadge.jsx';
import { getUpdatedRows, setInitialData, updateRow } from './customerSlice.js';

const menuItems = [
  {
    text: 'Add',
    type: 'add',
  },
  {
    text: 'Update',
    type: 'update',
  },
  {
    text: 'Delete',
    type: 'delete',
  },
];

function Customer() {
  // Pull the setter function from the outlet context
  const { setFooterText } = useOutletContext();

  const gridRef = useRef(null); // 1. Create a reference

  const relatedFetcher = useFetcher();
  const dispatch = useDispatch();

  const { customers } = useLoaderData();

  // 2. Subscribe to the live, mutable working copy from Redux
  const currentRowData = useSelector((state) => state.customer.currentRowData);
  const initialRowData = useSelector((state) => state.customer.initialRowData);
  const updatedCount = useSelector(getUpdatedRows);

  const [rowCount, setRowCount] = useState(0);
  const [selectedCustomerIdsToDelete, setSelectedCustomerIdsToDelete] =
    useState([]);
  const [activeCustomerId, setActiveCustomerId] = useState(null);

  // ==================================================
  // UseEffect start
  useEffect(() => {
    setFooterText('Manage customer details');
  }, [setFooterText]);

  useEffect(() => {
    // console.log('Load customer data to redux');
    const processedData = customers.map((customer) => ({
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
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      createdBy: customer.createdBy.fullName,
      updatedBy: customer.updatedBy.fullName,
      updated: false,
      contactIds: customer.contacts
        .filter((contact) => !contact.deleted)
        .map((contact) => contact.id),
      noteIds: customer.notes
        .filter((note) => !note.deleted)
        .map((note) => note.id),
      deleted: customer.deleted,
    }));

    dispatch(setInitialData(processedData));
  }, [customers, dispatch]);
  // UseEffect end
  // ==================================================

  const relatedRecords =
    relatedFetcher.data?.mode === 'related'
      ? relatedFetcher.data
      : {
          contacts: [],
          notes: [],
        };

  // Wrapped in useCallback to stop re-rendering cycles on grid callbacks
  const updateRowCount = useCallback(() => {
    if (gridRef.current?.api) {
      setRowCount(gridRef.current.api.getDisplayedRowCount());
    }
  }, []);

  // handle a row is beling clicked
  const customerRowClassRules = useMemo(
    () => ({
      'active-customer-row': (params) => params.data?.id === activeCustomerId,
    }),
    [activeCustomerId],
  );

  const onRowClicked = useCallback(
    (event) => {
      const customer = event.data;

      console.log('>>> inside [onRowClicked] : ', customer);

      // Do nothing if this customer is already active.
      if (customer.id === activeCustomerId) return;

      setActiveCustomerId(customer.id);

      const params = new URLSearchParams();
      params.set('mode', 'related');

      customer.contactIds?.forEach((id) =>
        params.append('contactId', String(id)),
      );
      customer.noteIds?.forEach((id) => params.append('noteId', String(id)));
      // console.log(`onRowClick parmas : ${params.toString()}`);

      relatedFetcher.load(`/customer?${params.toString()}`);
    },
    [relatedFetcher, activeCustomerId],
  );

  // handle checkbox selection
  const onSelectionChanged = useCallback((event) => {
    console.log('>>> inside [onSelectionChanged]...');

    const selectedIds = event.api
      .getSelectedRows()
      .map((customer) => customer.id);

    setSelectedCustomerIdsToDelete(selectedIds);
  }, []);

  // after cell is being edited
  const onCellEditRequest = useCallback(
    (event) => {
      console.log('>>> inside [onCellEditRequest]...');

      const { data, colDef, newValue } = event;
      dispatch(
        updateRow({
          id: data.id,
          field: colDef.field,
          newValue: newValue,
        }),
      );
    },
    [dispatch],
  );

  return (
    <div className="grid h-full min-h-0 min-w-0 grid-cols-2 grid-rows-[minmax(0,2.3fr)_minmax(0,2fr)] gap-1 overflow-hidden p-1">
      <div className="col-span-2 flex min-h-0 min-w-0 flex-col overflow-hidden border border-slate-200 p-2">
        <div className="m-1 flex shrink-0 items-center rounded bg-indigo-300 p-1.5">
          <div className="px-3 py-1 text-xl font-semibold text-stone-700">
            Customers
          </div>
          <nav className="ml-2 flex items-center justify-center gap-2">
            {menuItems.map((item) => {
              return (
                <ChangeBadge
                  key={item.type} // Added unique key here!
                  label={item.text}
                  count={
                    item.type === 'update'
                      ? updatedCount.length
                      : item.type === 'delete'
                        ? selectedCustomerIdsToDelete.length
                        : 0
                  }
                  type={item.type}
                />
              );
            })}
          </nav>
          <div className="ml-auto px-3 py-1 text-xl">
            <span>Total Customers : [</span>
            <span>{rowCount}</span>
            <span>]</span>
          </div>
        </div>

        <div className="ag-theme-alpine m-1 min-h-0 min-w-0 flex-1">
          <AgGridReact
            // basic setup start
            rowData={currentRowData}
            columnDefs={customerColumnDefs}
            gridOptions={customerGridOptions}
            rowSelection={rowSelection}
            // basic setup end

            // when row being click
            rowClassRules={customerRowClassRules}
            onRowClicked={onRowClicked}

            // when checkbox is clicked
            selectionColumnDef={selectionColumnDef}
            onSelectionChanged={onSelectionChanged}

            // for updateRowCount
            ref={gridRef}
            onModelUpdated={updateRowCount} // Automatically captures initial loads, filters, and searches

            // Redux store update start
            readOnlyEdit={true}
            onCellEditRequest={onCellEditRequest}
            getRowId={(params) => String(params.data.id)} // do not remove, this is needed
            context={{ initialRowData }}
            // Redux store update end
          />
        </div>
      </div>

      <Contact contacts={relatedRecords.contacts} />
      <Note notes={relatedRecords.notes} />
    </div>
  );
}

export default Customer;
