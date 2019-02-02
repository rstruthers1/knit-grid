import React, {Component} from 'react';
import {
  Button,
  Modal,
  Form,
  TextArea
} from 'semantic-ui-react'
import {isEqual} from 'lodash';

import '../../containers/App.css';

const initialState = {
  name: '',
  description: '',
  nameError: false,
  namePlaceHolder: 'Project Name'
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
      namePlaceHolder: 'Project Name'
    })
  };

  descriptionChangedHandler = (event) => {
    this.setState({
      description: event.target.value
    })
  };

  cancelAction = () => {
    this.props.closedAction(false);
  };

  okAction = () => {
    if (!this.state.name) {
      this.setState({
        nameError: true,
        namePlaceHolder: 'Name is required'
      });
      return;
    }
    this.props.closedAction(true, this.state.name,
        this.state.description);
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
