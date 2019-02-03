import React, {Component} from 'react';
import {
  Button,
  Modal,
  Form,
  TextArea
} from 'semantic-ui-react'
import {isEqual} from 'lodash';
import uuidv4 from 'uuid/v4';

import '../../containers/App.css';

const parseFetchResponse = response =>
    response.text()
    .then(text => {
      let json = null;
      try {
        json = JSON.parse(text);
      } catch (err) {
        json = {};
        json.message = "Unable to parse response body.";
        json.parseError = true;
      }

      return {
        json: json,
        bodyText: text,
        response: response
      }

    })
    .catch(response => {
      debugger;
      console.log("Caught error: " + JSON.stringify(response));
      debugger;
      return {
        json: {message: "error"},
        meta: response
      }
    });

const initialState = {
  name: '',
  description: '',
  nameError: false,
  namePlaceHolder: 'KnitGrid Name'
};

class NewKnitgridModal extends Component {

  state = {
    ...initialState
  };

  static getDerivedStateFromProps(props, state) {
    if (!props.visible && !isEqual(state, initialState)) {
      return {
        ...initialState
      };
    }
    // Return null to indicate no change to state.
    return null;
  }

  nameChangedHandler = (event) => {
    this.setState({
      name: event.target.value,
      nameError: false,
      namePlaceHolder: 'KnitGrid Name'
    })
  };

  descriptionChangedHandler = (event) => {
    this.setState({
      description: event.target.value
    })
  };

  cancelAction = () => {
    this.props.closedAction();
  };

  okAction = () => {
    if (!this.state.name) {
      this.setState({
        nameError: true,
        namePlaceHolder: 'Name is required'
      });
      return;
    }
    this.createKnitGrid();
  };

  initKnitgrid = (rows, columns) => {

    const grid = [];
    for (let i = 0; i < rows; i++) {
      const cells = [];
      for (let j = 0; j < columns; j++) {
        const cell = {
          id: uuidv4(),
          value: "",
          selected: (i === 0 && j === 0)
        };
        cells.push(cell);
      }
      const row = {
        id: uuidv4(),
        cells: cells
      };
      grid.push(row);
    }

    const knitgrid = {
      name: this.state.name,
      description: this.state.description,
      id: null,
      grid: grid
    };
    return knitgrid;
  };

  createKnitGrid = () => {
    if (!this.state.name) {
      return;
    }
    const knitgrid = this.initKnitgrid(10, 10);
    fetch('/api/knitgrids/', {
      method: 'POST',
      body: JSON.stringify({
        projectId: this.props.projectId,
        name: this.state.name,
        description: this.state.description,
        grid: knitgrid.grid
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then(parseFetchResponse)
    .then(({json, bodyText, response}) => {
      if (response.status !== 200) {
        let errorMessage = "Unknown Error";
        if (json.message) {
          if (!json.parseError) {
            errorMessage = json.message;
          } else {
            errorMessage = bodyText;
          }
        }
        console.log("*** error: " + errorMessage);
        this.props.closedAction(this.props.projectId, null);
        return;
      }
      console.log("Successfully created knitgrid, calling closedAction");
      console.log("returned json: " + JSON.stringify(json));
      knitgrid.id = json.knitgridId;
      this.props.closedAction(this.props.projectId, knitgrid);
    })
    .catch(error => {
      console.error('Error:', error.message);
      this.props.closedAction(this.props.projectId, null);
    });
  };

  render() {
    const formFieldStyle = {
      width: '300px'
    };

    return (
        <Modal size='tiny' dimmer='inverted' open={this.props.visible}
               centered={true}>
          <Modal.Header>New KnitGrid</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input fluid
                          label='KnitGrid Name'
                          placeholder={this.state.namePlaceHolder}
                          style={formFieldStyle}
                          onChange={(event) => this.nameChangedHandler(
                              event)}
                          value={this.state.name}
                          required
                          error={this.state.nameError}
              />
              <Form.Field control={TextArea}
                          label='Description'
                          placeholder='Describe your KnitGrid...'
                          onChange={(event) => this.descriptionChangedHandler(
                              event)}
                          value={this.state.description}
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={this.cancelAction}>
              Cancel
            </Button>
            <Button
                positive
                icon='checkmark'
                labelPosition='right'
                content="Create"
                onClick={this.okAction}
            />
          </Modal.Actions>
        </Modal>
    )
  }
}

export default NewKnitgridModal;
