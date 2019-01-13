import React, {Component} from 'react';
import {
  Button,
  Modal,
  Form
} from 'semantic-ui-react'
import {isEqual} from 'lodash';

import '../../containers/App.css';

const initialState = {
  projectId: null,
  projectName: null,
  options: [],
  projectNameError: false,
  projectNamePlaceHolder: 'Loading Projects...',
  dataStatus: 'loading'
};

class OpenProjectModal extends Component {

  state = {
    ...initialState
  };

  static getDerivedStateFromProps(props, state) {
    if (!props.visible && !isEqual(state, initialState)) {
      console.log("Initializing state");
      return {
        ...initialState
      };
    }
    // Return null to indicate no change to state.
    return null;
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    console.log("componentDidUpdate");
    if (this.props.visible && !prevProps.visible) {
      console.log("calling fetchProjects");
      this.fetchProjects();
    }
  }

  fetchProjects = () => {
    console.log("*** fetching projects");
    fetch('/api/projects', {
      method: 'GET',
      Accept: 'application/json'
    }).then(res => res.json())
    .then(response => {
      let options = response.projects.map(row => {
        return {
          key: row.id,
          value: row.id,
          id: row.id,
          text: row.name
        }
      });
      this.setState({
        options: options,
        projectNamePlaceHolder: 'Project Name',
        dataStatus: 'loaded'
      })
    })
    .catch(error => {
      console.error('Error:', error);
      this.setState({
        projectNamePlaceHolder: 'Error loading projects.',
        dataStatus: 'error'
      })
    });
  };

  projectNameSelectedHandler = (event, result) => {
    const {name, value} = result;
    const projectId = value;
    const projectName = name;
    console.log("projectNameSelectedHandler, projectId: " + projectId);

    this.setState({
      projectId: projectId,
      projectName: projectName,
      projectNameError: false,
      projectNamePlaceHolder: 'Project Name'
    })
  };

  cancelAction = () => {
    this.props.closedAction(false);
  };

  okAction = () => {
    if (!this.state.projectId) {
      console.log("*** ok - this.state.projectId is not set");
      this.setState({
        projectNameError: true,
        projectNamePlaceHolder: 'Please select a project'
      });
      return;
    }
    this.props.closedAction(true, this.state.projectId, this.state.projectName);
  };

  render() {
    const formFieldStyle = {
      width: '300px'
    };
    console.log("render, options: " + JSON.stringify(this.state.options));

    return (
        <Modal size='large' dimmer='inverted' open={this.props.visible}
               centered={true}>
          <Modal.Header>Open Project</Modal.Header>
          <Modal.Content>
            <Form>
        <Form.Select fluid
                     label='Project Name'
                     placeholder={this.state.projectNamePlaceHolder}
                     style={formFieldStyle}
                           onChange={(event, result) => this.projectNameSelectedHandler(
                               event, result)}
                     options={[...this.state.options]}
                     error={this.state.projectNameError}
        />
            </Form>
            <div style={{height: '50px'}}>
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={this.cancelAction}>
              Cancel
            </Button>
            <Button
                positive
                icon='checkmark'
                labelPosition='right'
                content="Open"
                onClick={this.okAction}
            />
          </Modal.Actions>
        </Modal>
    )
  }
}

export default OpenProjectModal;
