import React, {Component} from 'react';
import SortableTree from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import { Button, Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react';


import './App.css';
import KnitGridMenu from '../components/Menu/KnitGridMenu';
import NewProjectModal from '../components/modals/NewProjectModal';
import OpenProjectModal from '../components/modals/OpenProjectModal';

class App extends Component {

  state = {
    data: null,
    projectName: "",
    projectDescription: "",
    newProjectModalVisible: false,
    openProjectModalVisible: false,
    projectTreeData: [{
      title: 'Create or open a project',
      expanded: true,
      key: 'root'
    }],
    knitgrids: [],
    selectedKnitgrid: null
  };

  handleProjectTreeChanged = (treeData) => {
    console.log("*** handleProjectTreeChanged");
    this.setState({
      projectTreeData: treeData
    })
  };

  handleMenuSelection = (whichMenuItem) => {
    console.log("Menu selected: " + whichMenuItem);
    switch (whichMenuItem) {
      case "NEW_PROJECT":
        this.setState({
          newProjectModalVisible: true
        });
        break;
      case "OPEN_PROJECT":
        this.setState({
          openProjectModalVisible: true
        });
        break;
      default:
        console.log("default selected")
    }
  };

  createProject = (projectName, description) => {
    const newProjectTreeData = [{
      title: projectName,
      expanded: true,
      key: 'root',
      children: [{
        title: 'Add files to your project',
        key: 'placeHolderNode'
      }]
    }];

    fetch('/api/projects', {
      method: 'PUT',
      body: JSON.stringify({
        name: projectName,
        description: description
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then(response => {
      this.setState({
        newProjectModalVisible: false,
        projectName: projectName,
        projectDescription: description,
        projectTreeData: newProjectTreeData
      })
    })
    .catch(error => {
      console.error('Error:', error);
      this.setState({
        newProjectModalVisible: false
      })
    });
  };

  fetchProject = (id, projectName) => {
    console.log('URL: /api/projects/' + id);
    fetch('/api/projects/' + id, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    }).then(res => res.json())
    .then(response => {
      console.log("*** project: " + JSON.stringify(response.project));

      if (response.project) {
        let children = null;
        if (response.project.knitgrids && response.project.knitgrids.length > 0) {
          children = response.project.knitgrids.map(knitgrid => {
            return {
              title: knitgrid.name,
              key: knitgrid.id
            }
          })
        } else {
          children = [
            {
              title: 'Add files to your project',
              key: 'placeHolderNode'
            }
          ]
        }
        this.setState({
          openProjectModalVisible: false,
          projectTreeData: [{
            title: response.project.name,
            expanded: true,
            key: 'root',
            children: children
          }],
          knitgrids: response.project.knitgrids
        })
      }
      else {
        this.setState({
          openProjectModalVisible: false,
          projectTreeData: [{
            title: projectName,
            expanded: true,
            key: 'root',
            children: [{
              title: 'Unable to find project',
              key: 'placeHolderNode'
            }]
          }],
          knitgrids: response.project.knitgrids
        })
      }
    })
    .catch(error => {
      console.error('Error:', error);
      this.setState({
        openProjectModalVisible: false,
        projectTreeData: [{
          title: projectName,
          expanded: true,
          key: 'root',
          children: [{
            title: 'Error loading project',
            key: 'placeHolderNode'
          }]
        }]
      });
    });
  };

  newProjectModalClosed = (okSelected, newProjectName,
      newProjectDescription) => {

    if (okSelected) {
      this.createProject(newProjectName, newProjectDescription);
    } else {
      this.setState({
        newProjectModalVisible: false,
      })
    }
  };

  openProjectModalClosed = (okSelected, projectId, projectName) => {
    if (okSelected) {
      console.log("*** projectId: " + projectId);
      console.log("*** projectName: " + projectName);
      this.fetchProject(projectId, projectName);
    } else {
      this.setState({
        openProjectModalVisible: false
      });
    }
  };

  onSelectNode = (rowInfo) => {
    console.log("Node selected: " + JSON.stringify(rowInfo));
    console.log("key of selected knitgrid: " + rowInfo.node.key);
    console.log("this.state.knitgrids: " + JSON.stringify(this.state.knitgrids));
    let selectedKnitgrid = this.state.knitgrids.find(el => {
      return el.id === rowInfo.node.key;
    });
    console.log("selectedKnitGrid: " + JSON.stringify(selectedKnitgrid));
    this.setState({
      selectedKnitgrid: selectedKnitgrid
    })
  };

  render() {
    let knitgrid = null;
    if (this.state.selectedKnitgrid) {
      knitgrid = (<pre>{JSON.stringify(this.state.selectedKnitgrid)}</pre>)
    }

    return (
        <div className="App">
          <NewProjectModal visible={this.state.newProjectModalVisible}
                           closedAction={this.newProjectModalClosed}/>
          <OpenProjectModal visible={this.state.openProjectModalVisible}
                            closedAction={this.openProjectModalClosed}/>
          <div>
            <KnitGridMenu clicked={this.handleMenuSelection}/>


              <SortableTree
                  style={{minHeight: '500px'}}
                  treeData={this.state.projectTreeData}
                  onChange={treeData => this.handleProjectTreeChanged(treeData)}
                  theme={FileExplorerTheme}
                  canDrag={false}
                  generateNodeProps={rowInfo => ({
                    onClick: () => this.onSelectNode(rowInfo)
                  })}
              />




          </div>
        </div>
    )
  }
}

export default App;
