import React, {Component} from 'react';
import {Grid} from 'semantic-ui-react';
import _ from 'lodash';

import './App.css';
import KnitGridMenu from '../components/Menu/KnitGridMenu';
import NewProjectModal from '../components/modals/NewProjectModal';
import OpenProjectModal from '../components/modals/OpenProjectModal';
import SaveProjectModal from '../components/modals/SaveProjectModal';
import NewKnitgridModal from '../components/modals/NewKnitgridModal';
import KnitGridTable from '../components/KnitGridTable';
import KnitGridTableEditor from '../components/KnitGridTableEditor';
import ProjectKnitGridList from '../components/ProjectKnitGridList';
import {MenuItemIds} from '../constants/Constants';

class App extends Component {

  state = {
    projectId: null,
    projectTreeData: [{
      title: 'Create or open a project',
      expanded: true,
      key: 'root'
    }],
    knitgrids: [],
    selectedKnitgridId: null,
    selectedCellIds: null,
    lastSavedSelectedCellIds: null,
    editing: false,
    registeredKeyboardShortcutHandler: null,
    newProjectModalVisible: false,
    openProjectModalVisible: false,
    saveProjectModalVisible: false,
    newKnitgridModalVisible: false
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
      case MenuItemIds.ADD_KNITGRID_TO_PROJECT:
        this.setState({
          newKnitgridModalVisible: true
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
        projectId: response.projectId,
        newProjectModalVisible: false,
        name: projectName,
        projectDescription: description,
        projectTreeData: newProjectTreeData,
        knitgrids: null,
        selectedKnitgridId: null,
        selectedCellIds: null,
        lastSavedSelectedCellIds: null
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
          selectedKnitgridId: null,
          selectedCellIds: selectedCellIds,
          lastSavedSelectedCellIds: [...selectedCellIds]
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
          selectedCellIds: null,
          lastSavedSelectedCellIds: null
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
        selectedCellIds: null,
        lastSavedSelectedCellIds: null
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

  saveProjectModalClosed = () => {
    this.setState({
      saveProjectModalVisible: false
    });
  };

  newKnitgridModalClosed = (projectId, knitgrid) => {
    console.log("newKnitgridModalClosed, projectId: " + projectId);
    if (knitgrid) {
      console.log("Adding knitgrid to project");
      this.addKnitgridToProject(projectId, knitgrid);
    } else {
      console.log("No knitgrid!");
    }
    this.setState({
      newKnitgridModalVisible: false,
    })
  };

  addKnitgridToProject = (projectId, knitgrid) => {
    console.log("addKnitgridToProject");
    if (!knitgrid) {
      console.log("no knitgrid");
    }
    if (projectId !== this.state.projectId) {
      console.log("projectId !== this.state.projectId, projectId: " + projectId
          + ", this.state.projectId: " + this.state.projectId);
    }
    if (!knitgrid || projectId !== this.state.projectId) {
      return;
    }

    let knitgrids = null;
    if (this.state.knitgrids) {
      knitgrids = _.cloneDeep(this.state.knitgrids);
    } else {
      knitgrids = [];
    }
    knitgrids.push(knitgrid);

    const projectTreeData = _.cloneDeep(this.state.projectTreeData);
    projectTreeData[0].children = knitgrids.map(knitgrid => {
      console.log("Adding knitgrid to tree, name: " + knitgrid.name +
          ", key: " + knitgrid.id);
      return {
        title: knitgrid.name,
        key: knitgrid.id
      }
    });

    console.log("projectTreeData: " + JSON.stringify(projectTreeData));

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

    console.log("selectedCellId: " + selectedCellId)
    let selectedCellIds = [selectedCellId];
    if (this.state.selectedCellIds) {
      selectedCellIds = [...this.state.selectedCellIds, selectedCellId];
    }

    let lastSavedSelectedCellIds = [selectedCellId];
    if (this.state.lastSavedSelectedCellIds) {
      lastSavedSelectedCellIds = [...this.state.lastSavedSelectedCellIds,
        selectedCellId];
    }

    this.setState({
      projectTreeData: projectTreeData,
      knitgrids: knitgrids,
      selectedKnitgridId: knitgrid.id,
      selectedCellIds: selectedCellIds,
      lastSavedSelectedCellIds: lastSavedSelectedCellIds
    });

  };

  projectSaved = (knitgrids) => {
    const lastSavedSelectedCellIds = [...this.state.selectedCellIds];
    const projectTreeData = _.cloneDeep(this.state.projectTreeData);
    projectTreeData[0].children = this.state.knitgrids.map((knitgrid, i) => {
      let title = knitgrid.name;
      return {
        title: title,
        key: knitgrid.id
      }
    });
    this.setState({
      knitgrids: knitgrids,
      lastSavedSelectedCellIds: lastSavedSelectedCellIds,
      projectTreeData: projectTreeData
    });
  };

  onSelectNode = (nodeId) => {
    this.setState({
      selectedKnitgridId: nodeId
    })
  };

  cellSelected = (selectedCellId) => {
    const selectedCellIds = [...this.state.selectedCellIds];
    selectedCellIds[this.findSelectedKnitGridIndex()] = selectedCellId;

    const projectTreeData = _.cloneDeep(this.state.projectTreeData);
    projectTreeData[0].children = this.state.knitgrids.map((knitgrid, i) => {
      let title = knitgrid.name;
      if (selectedCellIds[i] !== this.state.lastSavedSelectedCellIds[i]) {
        title += " *";
      }
      return {
        title: title,
        key: knitgrid.id
      }
    });
    this.setState({
      selectedCellIds: selectedCellIds,
      projectTreeData: projectTreeData
    });
  };

  makeOneCellSelected = (knitgrid) => {
    if (!knitgrid) {
      return;
    }
    let cellSelected = false;
    for (let i = 0; i < knitgrid.grid.length; i++) {
      const row = knitgrid.grid[i];
      for (let j = 0; j < row.cells.length; j++) {
        const cell = row.cells[j];
        if (cell.selected) {
          cellSelected = true;
          break;
        }
      }
      if (cellSelected) {
        break;
      }
    }
    if (!cellSelected) {
      knitgrid.grid[0].cells[0].selected = true;
    }
  };

  getSelectedCellId = (knitgrid) => {
    for (let i = 0; i < knitgrid.grid.length; i++) {
      const row = knitgrid.grid[i];
      for (let j = 0; j < row.cells.length; j++) {
        const cell = row.cells[j];
        if (cell.selected) {
          return cell.id;
        }
      }
    }
    return null;
  };

  knitgridUpdated = (knitgrid) => {
    this.makeOneCellSelected(knitgrid);
    const knitgrids = _.cloneDeep(this.state.knitgrids);
    const selectedCellIds = [...this.state.selectedCellIds];
    for (let k = 0; k < knitgrids.length; k++) {
      if (knitgrids[k].id === this.state.selectedKnitgridId) {
        knitgrids[k] = knitgrid;
        selectedCellIds[k] = this.getSelectedCellId(knitgrid);
        break;
      }
    }
    this.setState({
      knitgrids: knitgrids,
      selectedCellIds: selectedCellIds
    });
  };

  doneEditing = () => {
    this.setState({
      editing: false
    })
  };

  startEditing = () => {
    this.setState({
      editing: true
    })
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

  registerKeyboardShortcut = (keyboardCallback) => {
    if (this.state.registeredKeyboardShortcutHandler) {
      document.removeEventListener("keypress",
          this.state.registeredKeyboardShortcutHandler, false);
    }
    this.setState({
      registeredKeyboardShortcutHandler: keyboardCallback
    });
  };

  modalVisible = () => {
    return this.state.newProjectModalVisible ||
        this.state.openProjectModalVisible ||
        this.state.saveProjectModalVisible ||
        this.state.newKnitgridModalVisible;
  };

  render() {
    let knitgridTable = null;
    let knitgridTitle = "KnitGrid";
    let knitgrid = this.findSelectedKnitGrid();
    let knitgridIndex = this.findSelectedKnitGridIndex();

    if (knitgrid) {
      let lastSavedSelectedCellId = null;
      if (this.state.lastSavedSelectedCellIds &&
          knitgridIndex < this.state.lastSavedSelectedCellIds.length) {
        lastSavedSelectedCellId = this.state.lastSavedSelectedCellIds[knitgridIndex];
      }

      if (this.state.editing) {
        knitgridTable = (
            <KnitGridTableEditor
                knitgrid={knitgrid}
                knitgridUpdated={this.knitgridUpdated}
                doneEditing={this.doneEditing}
            />
        );
      } else {
        knitgridTable = (
            <KnitGridTable
                knitgrid={knitgrid}
                selectedCellId={this.state.selectedCellIds[knitgridIndex]}
                lastSavedSelectedCellId={lastSavedSelectedCellId}
                cellSelected={this.cellSelected}
                registerKeyboardShortcut={this.registerKeyboardShortcut}
                startEditing={this.startEditing}
            />
        );
      }
      knitgridTitle = knitgrid.name;
    }

    if (this.state.registeredKeyboardShortcutHandler) {
      document.removeEventListener("keypress",
          this.state.registeredKeyboardShortcutHandler, false);
      if (!this.modalVisible() && !this.state.editing) {
        document.addEventListener("keypress",
            this.state.registeredKeyboardShortcutHandler, false);
      }
    }

    return (
        <div className="App">
          <div>
            <KnitGridMenu clicked={this.handleMenuSelection}
                          projectCurrentlyOpen={this.state.projectId !== null}
                          knitgridCurrentlyOpen={this.state.selectedKnitgridId !== null}/>
            <div style={{
              paddingTop: "5em",
              paddingBottom: "0em",
              paddingLeft: "1em",
              paddingRight: "0em"
            }}>
              <Grid divided>
                <Grid.Column width={4} floated='left'>
                  <div className="tree">
                    <ProjectKnitGridList
                        projectTreeData={this.state.projectTreeData}
                        onSelectNode={this.onSelectNode}
                        selectedKnitgridId={this.state.selectedKnitgridId}
                    />
                  </div>
                </Grid.Column>
                <Grid.Column width={12}>
                  <h1>{knitgridTitle}</h1>
                  {knitgridTable}
                </Grid.Column>
              </Grid>
            </div>
          </div>
          <NewProjectModal visible={this.state.newProjectModalVisible}
                           closedAction={this.newProjectModalClosed}/>
          <OpenProjectModal visible={this.state.openProjectModalVisible}
                            closedAction={this.openProjectModalClosed}/>
          <SaveProjectModal visible={this.state.saveProjectModalVisible}
                            closedAction={this.saveProjectModalClosed}
                            knitgrids={this.state.knitgrids}
                            selectedCellIds={this.state.selectedCellIds}
                            projectId={this.state.projectId}
                            projectSaved={this.projectSaved}/>
          <NewKnitgridModal visible={this.state.newKnitgridModalVisible}
                            closedAction={this.newKnitgridModalClosed}
                            projectId={this.state.projectId}/>
        </div>
    )
  }
}

export default App;
