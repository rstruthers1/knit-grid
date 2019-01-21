import React, {Component} from 'react';
import {
  Container,
  Grid
} from 'semantic-ui-react';

import './App.css';
import KnitGridMenu from '../components/Menu/KnitGridMenu';
import NewProjectModal from '../components/modals/NewProjectModal';
import OpenProjectModal from '../components/modals/OpenProjectModal';
import SaveProjectModal from '../components/modals/SaveProjectModal';
import KnitGridTable from '../components/KnitGridTable';
import ProjectKnitGridList from '../components/ProjectKnitGridList';
import {MenuItemIds} from '../constants/Constants';

class App extends Component {

  state = {
    projectId: null,
    newProjectModalVisible: false,
    openProjectModalVisible: false,
    saveProjectModalVisible: false,
    projectTreeData: [{
      title: 'Create or open a project',
      expanded: true,
      key: 'root'
    }],
    knitgrids: [],
    selectedKnitgridId: null,
    selectedCellIds: null
  };

  handleMenuSelection = (whichMenuItem) => {
    switch (whichMenuItem) {
      case MenuItemIds.NEW_PROJECT:
        this.setState({
          newProjectModalVisible: true
        });
        break;
      case MenuItemIds.OPEN_PROJECT:
        this.setState({
          openProjectModalVisible: true
        });
        break;
      case MenuItemIds.SAVE_PROJECT:
        this.setState({
          saveProjectModalVisible: true
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
    fetch('/api/projects/' + id, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    }).then(res => res.json())
    .then(response => {
      if (response.project) {
        let children = null;
        let selectedCellIds = [];
        if (response.project.knitgrids && response.project.knitgrids.length
            > 0) {
          children = response.project.knitgrids.map(knitgrid => {
            return {
              title: knitgrid.name,
              key: knitgrid.id
            }
          });
          selectedCellIds = response.project.knitgrids.map(knitgrid => {
            let selectedCellId = null;
            for (let row of knitgrid.grid) {
              for (let cell of row.cells) {
                if (cell.selected) {
                  selectedCellId = cell.id;
                  break;
                }
              }
              if (selectedCellId) {
                break;
              }
            }
            return selectedCellId;
          })
        } else {
          children = [
            {
              title: 'Add files to your project',
              key: 'placeHolderNode'
            }
          ]
        }
        console.log("knitgrids: " + JSON.stringify(response.project.knitgrids));
        this.setState({
          projectId: response.project.id,
          openProjectModalVisible: false,
          projectTreeData: [{
            title: response.project.name,
            expanded: true,
            key: 'root',
            children: children
          }],
          knitgrids: response.project.knitgrids,
          selectedKnitgrId: null,
          selectedCellIds: selectedCellIds
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
          knitgrids: [],
          selectedKnitgridId: null,
          selectedCellIds: null
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
        }],
        knitgrids: [],
        selectedKnitgridId: null,
        selectedCellIds: null
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
      this.fetchProject(projectId, projectName);
    } else {
      this.setState({
        openProjectModalVisible: false
      });
    }
  };

  saveProjectModalClosed = (status) => {
    this.setState({
      saveProjectModalVisible: false
    });
  };

  projectSaved = (knitgrids) => {
    this.setState({
      knitgrids: knitgrids
    })
  }

  onSelectNode = (nodeId) => {
    this.setState({
      selectedKnitgridId: nodeId
    })
  };

  cellSelected = (selectedCellId) => {
    let selectedCellIds = [...this.state.selectedCellIds];
    selectedCellIds[this.findSelectedKnitGridIndex()] = selectedCellId;
    this.setState({
      selectedCellIds: selectedCellIds
    });
  };

  findSelectedKnitGrid = () => {
    if (!this.state.selectedKnitgridId) {
      return null;
    }

    if (!this.state.knitgrids) {
      return null;
    }

    for (let knitgrid of this.state.knitgrids) {
      if (knitgrid.id === this.state.selectedKnitgridId) {
        return knitgrid;
      }
    }
    return null;
  };

  findSelectedKnitGridIndex = () => {
    if (!this.state.selectedKnitgridId) {
      return null;
    }

    if (!this.state.knitgrids) {
      return null;
    }

    for (let i = 0; i < this.state.knitgrids.length; i++) {
      let knitgrid = this.state.knitgrids[i];
      if (knitgrid.id === this.state.selectedKnitgridId) {
        return i;
      }
    }
    return null;
  };

  render() {
    let knitgridTable = null;
    let knitgridTitle = "KnitGrid";
    let knitgrid = this.findSelectedKnitGrid();
    let knitgridIndex = this.findSelectedKnitGridIndex();

    if (knitgrid) {
      knitgridTable = (
          <KnitGridTable
              knitgrid={knitgrid}
              selectedCellId={this.state.selectedCellIds[knitgridIndex]}
              cellSelected={this.cellSelected}
          />
      );
      knitgridTitle = knitgrid.name;
    }

    return (
        <div className="App">
          <NewProjectModal visible={this.state.newProjectModalVisible}
                           closedAction={this.newProjectModalClosed}/>
          <OpenProjectModal visible={this.state.openProjectModalVisible}
                            closedAction={this.openProjectModalClosed}/>
          <SaveProjectModal visible={this.state.saveProjectModalVisible}
                            closedAction={this.saveProjectModalClosed}
                            knitgrids={this.state.knitgrids}
                            selectedCellIds={this.state.selectedCellIds}
                            projectId={this.state.projectId}
                            projectSaved={this.projectSaved}
          />

          <div>
            <KnitGridMenu clicked={this.handleMenuSelection}/>
            <Container style={{padding: '0em 0em'}}>
              <Grid divided>
                <Grid.Column width={4} floated='left'>
                  <ProjectKnitGridList
                      projectTreeData={this.state.projectTreeData}
                      onSelectNode={this.onSelectNode}
                      selectedKnitgridId={this.state.selectedKnitgridId}
                  />
                </Grid.Column>
                <Grid.Column width={12}>
                  <h1>{knitgridTitle}</h1>
                  {knitgridTable}
                </Grid.Column>
              </Grid>
            </Container>
          </div>
        </div>
    )
  }
}

export default App;
