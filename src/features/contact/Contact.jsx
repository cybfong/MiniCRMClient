import { AgGridReact } from 'ag-grid-react';
import {
  contactColumnDefs,
  contactGridOptions,
} from '../../ui/datagrid/ContactGridConfig';

import { useCallback, useState } from 'react';
import { iconCheck, iconPlus } from '../../ui/icons/AppIcons';

const menuItems = [
  {
    text: 'Add',
    action: 'add',
    icon: iconPlus,
    bgColor: 'bg-red-700',
    hoverColor: 'hover:bg-red-600/40',
  },
  {
    text: 'Confirm',
    action: 'confirm',
    icon: iconCheck,
    bgColor: 'bg-emerald-700',
    hoverColor: 'hover:bg-emerald-600/40',
  },
];

function Contact({ contacts }) {
  // console.log(`Related Contact : ${contacts}`);

  const [gridApi, setGridApi] = useState(null);

  const onSelectionChanged = () => {
    const selectedData = gridApi?.getSelectedRows() ?? [];
    if (selectedData.length === 0) return;

    console.log('Contact :', selectedData[0].firstName);
  };

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
  }, []);

  return (
    <div className="flex min-h-0 min-w-0 flex-col overflow-hidden border border-slate-200 p-2">
      <div className="m-1 flex shrink-0 items-center rounded bg-indigo-300 p-1.5">
        <div className="px-3 py-1 text-xl font-semibold text-stone-700">
          Contacts
        </div>
        <nav className="ml-2 flex items-center justify-center gap-2">
          {menuItems.map((item) => {
            const bgColor = item.bgColor;
            const hoverColor = item.hoverColor;

            return (
              <button
                key={item.action}
                type="button"
                //onClick={() => handleIconClick(item)}
                title={item.text}
                aria-label={item.text}
                className={`${bgColor} ${hoverColor} flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors duration-200 hover:text-stone-200`}
              >
                {item.icon}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="ag-theme-alpine m-1 min-h-0 min-w-0 flex-1">
        <AgGridReact
          rowData={contacts}
          columnDefs={contactColumnDefs}
          gridOptions={contactGridOptions}
          // domLayout="autoHeight"
          rowSelection="single"
          onSelectionChanged={onSelectionChanged}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
}

export default Contact;
