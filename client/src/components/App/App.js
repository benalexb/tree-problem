import { useEffect, useState } from 'react';
import './App.css';
import Tree from 'react-d3-tree';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function App() {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [node, setNode] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const { data: fetchedData } = await axios.get('http://localhost:5000/api/graph');
        setData(fetchedData);
      } catch (error) {
        console.error(error);
      }
    })()
  }, []);

  return (
    <div className="app">
      {!!data && (
        <div id="treeWrapper" className="treeWrapper">
          <Tree
            data={data}
            collapsible={false}
            pathFunc="step"
            translate={{ x: 500, y: 500 }}
            nodeSize={{ x: 300, y: 140 }}
            onNodeClick={({ data }) => {
              setNode(data);
              setOpen(true);
            }}
          />
        </div>
      )}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>{node.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {node.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;
