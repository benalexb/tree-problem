import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import Tree from 'react-d3-tree';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Popover from '@material-ui/core/Popover';

export const App = () => {
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
        <div id="treeWrapper" className="treeWrapper" data-testid="tree-wrapper">
          <Tree
            zoomable
            data={data}
            collapsible={false}
            pathFunc="step"
            translate={{ x: 200, y: 400 }}
            nodeSize={{ x: 300, y: 100 }}
            onNodeClick={({ data: nodeData }, { target }) => {
              target.classList.add('selected-circle');
              circle.current = target;
              setNode(nodeData);
              setOpen(true);
            }}
          />
        </div>
      )}
      <Popover
        data-testid="pop-over"
        open={open}
        anchorEl={circle.current}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <DialogTitle data-testid="node-title">{node.name}</DialogTitle>
        <DialogContent>
          <DialogContentText data-testid="node-description">{node.description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button data-testid="dialog-close-button" onClick={handleClose}>Close</Button>
        </DialogActions>
      </Popover>
    </div>
  );
}

export default App;
