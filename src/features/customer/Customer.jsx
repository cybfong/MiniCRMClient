import { AgGridReact } from 'ag-grid-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFetcher, useLoaderData, useOutletContext } from 'react-router-dom';
import ChangeBadge from '../../ui/badge/ChangeBadge.jsx';
import Button from '../../ui/Button.jsx';
import {
  customerColumnDefs,
  customerGridOptions,
  rowSelection,
  selectionColumnDef,
} from '../../ui/datagrid/CustomerGridConfig';
import {
  createCustomer,
  deleteCustomer,
  updateCustomer,
} from '../../utils/apiMiniCRM.jsx';
import Contact from '../contact/Contact';
import { getFullName } from '../login/authSlice.js';
import Note from '../note/Note';
import {
  addRow,
  EDITABLE_FIELDS,
  getNewRows,
  getUpdatedRows,
  setInitialData,
  setRowsMarkedForDelete,
  updateCustomerStateData,
  updateRow,
} from './customerSlice.js';

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
  const { setFooterText, setOptionalFooterText, setOptionalFooterStyle } =
    useOutletContext();

  const gridRef = useRef(null); // 1. Create a reference

  const relatedFetcher = useFetcher();
  const dispatch = useDispatch();

  const { customers } = useLoaderData();

  // 2. Subscribe to the live, mutable working copy from Redux
  const currentRowData = useSelector((state) => state.customer.currentRowData);
  const initialRowData = useSelector((state) => state.customer.initialRowData);
  const updatedCount = useSelector(getUpdatedRows);
  const newCount = useSelector(getNewRows);
  const fullName = useSelector(getFullName);

  const [rowCount, setRowCount] = useState(0);
  const [selectedCustomerIdsToDelete, setSelectedCustomerIdsToDelete] =
    useState([]);
  const [activeCustomerId, setActiveCustomerId] = useState(null);

  const [gridApi, setGridApi] = useState(null);

  // ==================================================
  // UseEffect start
  useEffect(() => {
    setFooterText('Manage customer details');
    setOptionalFooterText('');
    setOptionalFooterStyle('');
  }, [setFooterText, setOptionalFooterText, setOptionalFooterStyle]);

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
  const onSelectionChanged = useCallback(
    (event) => {
      // console.log('>>> inside [onSelectionChanged]...');

      const selectedIds = event.api
        .getSelectedRows()
        .map((customer) => customer.id);

      setSelectedCustomerIdsToDelete(selectedIds);
      dispatch(setRowsMarkedForDelete(selectedIds));
    },
    [dispatch],
  );

  // after cell is being edited
  const onCellEditRequest = useCallback(
    (event) => {
      // console.log('>>> inside [onCellEditRequest]...');

      const { data, colDef, newValue } = event;

      // Check for null, undefined, empty string, or whitespace-only
      const isEmpty =
        newValue == null ||
        (typeof newValue === 'string' && newValue.trim() === '');

      if (isEmpty) {
        if (gridApi) {
          gridApi.refreshCells({ rowNodes: [event.node], force: true });
        }
        return;
      }

      // Logic to remove check-box (mark for delete)
      const wasMarkedForDelete = Boolean(data.deleted);
      if (wasMarkedForDelete) {
        // Tells AG-Grid to uncheck/deselect that specific row (event.node) right away
        event.node?.setSelected(false, false, 'cellEdit');
        // Removes this row's ID from selectedCustomerIdsToDelete array
        setSelectedCustomerIdsToDelete((prev) =>
          prev.filter((id) => String(id) !== String(data.id)),
        );
      }

      dispatch(
        updateRow({
          id: data.id,
          field: colDef.field,
          newValue: newValue,
        }),
      );

      // Just ensure reapply the grid cellClassRules
      if (wasMarkedForDelete && gridApi) {
        gridApi.refreshCells({ rowNodes: [event.node], force: true });
      }
    },
    [dispatch, gridApi],
  );

  // This triggers automatically when AG Grid is fully loaded
  const onGridReady = (params) => {
    setGridApi(params.api); // <--- Save the API to your state here
  };

  // When Add customer button is clicked
  const handleAddNewRow = () => {
    // 1. Add to bottom of Redux
    dispatch(addRow(fullName));

    // 2. Control the grid UI view safely
    setTimeout(() => {
      if (!gridApi) return;

      const lastIndex = gridApi.getDisplayedRowCount() - 1;
      if (lastIndex < 0) return;

      // Focus on new added row for input
      const rowNode = gridApi.getDisplayedRowAtIndex(lastIndex);
      if (rowNode?.data?.id) {
        setActiveCustomerId(rowNode.data.id);
      }

      gridApi.ensureIndexVisible(lastIndex);
      gridApi.setFocusedCell(lastIndex, 'customerName');
      gridApi.startEditingCell({
        rowIndex: lastIndex,
        colKey: 'customerName',
      });
    }, 50);
  };

  // Check if there is any incomplete new row
  const hasIncompleteNewRow = useMemo(() => {
    return currentRowData.some(
      (row) =>
        row.isNew &&
        EDITABLE_FIELDS.some(
          (field) => !row[field] || String(row[field]).trim() === '',
        ),
    );
  }, [currentRowData]);

  // Handle Confirm action with validation
  const handleConfirm = async () => {
    const newRows = currentRowData.filter((row) => row.isNew);

    for (const row of newRows) {
      const hasEmptyField = EDITABLE_FIELDS.some(
        (field) => !row[field] || String(row[field]).trim() === '',
      );

      if (hasEmptyField) {
        // Set red warning styles
        setOptionalFooterStyle('font-bold text-rose-500');
        setOptionalFooterText(
          'Please fill in all data fields for new customer rows !',
        );

        // active row ID of the incomplete NEW customer
        setActiveCustomerId(row.id);

        if (gridApi) {
          const rowNode = gridApi.getRowNode(String(row.id));

          // rowNode.rowIndex : is the grid's actual visual row index
          // currentRowData.findIndex(...) : is just a safety net if rowNode.rowIndex is not available
          const targetRowIndex =
            rowNode?.rowIndex != null && rowNode.rowIndex >= 0
              ? rowNode.rowIndex
              : currentRowData.findIndex((r) => r.id === row.id);

          if (targetRowIndex !== -1) {
            gridApi.ensureIndexVisible(targetRowIndex);
            setTimeout(() => {
              gridApi.setFocusedCell(targetRowIndex, 'customerName');
              gridApi.startEditingCell({
                rowIndex: targetRowIndex,
                colKey: 'customerName',
              });
            }, 0);
          }
        }
        return; // Abort save
      }
    }

    // Proceed with save API dispatch...
    const updatedRows = currentRowData.filter(
      (row) => row.updated && !row.isNew,
    );
    const deletedRows = currentRowData.filter((row) => row.deleted);

    // Set green success styles
    setOptionalFooterStyle('font-semibold text-emerald-500');
    setOptionalFooterText('Saving Changes...');

    const idsToRefresh = [];

    try {
      // 1. handle NEW rows (if any)
      for (const row of newRows) {
        const responseData = await createCustomer(row);
        console.log('Saved data (NEW) : ', responseData);
        // After receiving data following actions are needed :
        // 1) update the currentRowData new customer id returned
        // 2) add the same data to initialRowData
        // 3) set isNew to false
        dispatch(
          updateCustomerStateData({
            savedCustomer: responseData,
            rowId: row.id,
            isNew: true,
            isUpdated: false,
            isDeleted: false,
          }),
        );

        if (responseData?.id != null) {
          idsToRefresh.push(responseData.id);
        }
      }

      // 2. handle UPDATED rows
      // console.log('Number of rows with update : ', updateRows);
      for (const row of updatedRows) {
        const responseData = await updateCustomer(row);
        console.log('Saved data (UPDATED): ', responseData);
        // After receiving data following actions are needed :
        // 1) update the currentRowData new customer id
        // 2) update the same data to initialRowData
        dispatch(
          updateCustomerStateData({
            savedCustomer: responseData,
            rowId: row.id,
            isNew: false,
            isUpdated: true,
            isDeleted: false,
          }),
        );

        idsToRefresh.push(row.id);
      }

      // 3. handle DELETED rows
      for (const row of deletedRows) {
        const responseData = await deleteCustomer(row.id);
        console.log('Saved data (DELETED) : ', row.id, responseData);
        // After receiving data following actions are needed :
        // 1) update the currentRowData new customer id
        // 2) update the same data to initialRowData
        dispatch(
          updateCustomerStateData({
            savedCustomer: responseData,
            rowId: row.id,
            isNew: false,
            isUpdated: false,
            isDeleted: true,
          }),
        );

        if (activeCustomerId === row.id) {
          setActiveCustomerId(null);
        }
      }

      if (deletedRows.length > 0) {
        setSelectedCustomerIdsToDelete([]);
      }

      if (gridApi && idsToRefresh.length > 0) {
        // console.log('Trying to refresh ag-grid');
        const rowNodes = idsToRefresh
          .map((id) => gridApi.getRowNode(String(id)))
          .filter(Boolean);

        if (rowNodes.length > 0) {
          gridApi.refreshCells({
            rowNodes,
            force: true, // Forces AG-Grid to re-run cellClassRules / checkCellUpdatedRule
          });
        }
      }

      setOptionalFooterText('Changes saved successfully!');
    } catch (error) {
      console.error('Error while saving customer changes:', error);
      setOptionalFooterStyle('font-bold text-rose-500');
      setOptionalFooterText('Failed to save changes. Please try again.');
    }
  };

  return (
    <div className="grid h-full min-h-0 min-w-0 grid-cols-2 grid-rows-[minmax(0,2.3fr)_minmax(0,2fr)] gap-1 overflow-hidden p-1">
      <div className="col-span-2 flex min-h-0 min-w-0 flex-col overflow-hidden border border-slate-200 p-2">
        <div className="m-1 flex shrink-0 items-center rounded bg-indigo-300 p-1.5">
          <div className="flex px-3 py-1 text-xl font-semibold text-stone-700">
            <span>Customers [Total : {rowCount}]</span>
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
                        : item.type === 'add'
                          ? newCount.length
                          : 0
                  }
                  type={item.type}
                />
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-3 px-3 py-1 text-xl">
            {/* <div>
              <span>Total Customers : [</span>
              <span>{rowCount}</span>
              <span>]</span>
            </div> */}
            <Button
              type="small"
              onClick={handleAddNewRow}
              disabled={hasIncompleteNewRow}
            >
              Add Customer
            </Button>
            <Button type="small" onClick={handleConfirm}>
              Confirm
            </Button>
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

            // handle add row
            onGridReady={onGridReady}
          />
        </div>
      </div>

      <Contact contacts={relatedRecords.contacts} />
      <Note notes={relatedRecords.notes} />
    </div>
  );
}

export default Customer;
