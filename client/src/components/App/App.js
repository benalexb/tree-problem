import './App.css';
import { useEffect, useState, useRef } from 'react';
import Tree from 'react-d3-tree';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Popover from '@material-ui/core/Popover';

function App() {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [node, setNode] = useState({});
  const circle = useRef(null);

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

  const handleClose = () => {
    setOpen(false);
    circle.current.classList.remove('selected-circle');
  }

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
            onNodeClick={({ data }, { target }) => {
              target.classList.add('selected-circle');
              circle.current = target;
              setNode(data);
              setOpen(true);
            }}
          />
        </div>
      )}
      <Popover
        open={open}
        anchorEl={circle.current}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <DialogTitle>{node.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>{node.description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Popover>
    </div>
  );
}

export default App;
