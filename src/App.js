import React, { useState, useEffect } from 'react';
import './App.css';
import MaterialTable, { MTableToolbar } from 'material-table';
import { Container } from '@material-ui/core'
import axios from 'axios';


function App() {

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/users")
      .then(res => {
        setTableData(...tableData, res.data);
        //console.log(tableData);
      })
      .catch(err => {
        console.log(err);
      })
  }, [tableData])

  const columns = [
    { title: "Serial", field: "id", emptyValue: () => <em>null</em> },
    { title: "Name", field: "name", emptyValue: () => <em>null</em> },
    { title: "Username", field: "username", emptyValue: () => <em>null</em> },
    { title: "Email", field: "email", emptyValue: () => <em>null</em> },
    { title: "Phone", field: "phone", emptyValue: () => <em>null</em> },
    { title: "Website", field: "website", emptyValue: () => <em>null</em> }
  ]

  return (
    <div className="App">
      <Container>
        <h1>USER TABLE</h1>
        <MaterialTable
          components={{
            Toolbar: props => (
              <div style={{ backgroundColor: '#e8eaf5' }}>
                <MTableToolbar {...props} />
              </div>
            )
          }}
          columns={columns}
          options={{
            sorting: true, search: true,
            searchFieldAlignment: "right", searchAutoFocus: true, searchFieldVariant: "standard",
            filtering: true, paging: true, pageSizeOptions: [5, 10, 20, 25, 50, 100], pageSize: 5,
            paginationType: "stepped", showFirstLastPageButtons: false, paginationPosition: "both", exportButton: true,
            exportAllData: true, exportFileName: "TableData", addRowPosition: "first", actionsColumnIndex: -1, selection: true,
            showSelectAllCheckbox: false, showTextRowsSelected: false, selectionProps: rowData => ({
              disabled: rowData.age == null,
            }),
            grouping: true, columnsButton: true,
            rowStyle: (data, index) => index % 2 === 0 ? { background: "#f5f5f5" } : null,
            headerStyle: { background: "#A7BBC7", color: "#fff" }
          }}
          data={tableData}
          title="User Information"

          editable={{
            onRowAdd: (newRow) => new Promise((resolve, reject) => {
              console.log(newRow)
              axios.post("https://jsonplaceholder.typicode.com/user", newRow)
                .then(res => {
                  console.log(res.data);
                  setTableData([...tableData, res.data]);
                  resolve()
                })
                .catch(err => {
                  console.log(err);
                })

            }),
            onRowUpdate: (newRow, oldRow) => new Promise((resolve, reject) => {
              const updatedData = [...tableData]
              axios.put(`https://jsonplaceholder.typicode.com/user/${oldRow.tableData.id}`, updatedData)
                .then(res => {
                  console.log(res.data);
                  updatedData[oldRow.tableData.id] = newRow;
                  setTableData(res.data);
                  resolve()
                })
                .catch(err => {
                  console.log(err);
                })

            }),
            onRowDelete: (selectedRow) => new Promise((resolve, reject) => {
              console.log(selectedRow);
              axios.delete(`https://jsonplaceholder.typicode.com/user/${selectedRow.tableData.id}`)
                .then(res => {
                  console.log(res.data);
                  setTableData(res.data);
                  resolve()
                })
                .catch(err => {
                  console.log(err);
                })
              const updatedData = [...tableData];
              updatedData.splice(selectedRow.tableData.id, 1)
              setTableData(updatedData);
              setTimeout(() => resolve(), 1000)
            })
          }}
        />
      </Container>
    </div>
  );
}

export default App;
