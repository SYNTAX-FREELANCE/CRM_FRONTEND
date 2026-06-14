import React, { useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

ModuleRegistry.registerModules([AllCommunityModule])

const MasterTable = ({ columnDefs, rowData }) => {


  
  const defaultColDef = useMemo(() => ({
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true
  }), [])

  return (
    <div
      className="ag-theme-alpine"
      style={{ height: "400px", width: "100%" }}
    >
      <AgGridReact
        theme="legacy"   // IMPORTANT FIX
        rowData={rowData || []}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={10}
      />
    </div>
  )
}

export default MasterTable