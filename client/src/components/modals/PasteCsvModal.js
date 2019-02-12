import React, {Component} from 'react';
import {
  Button,
  Modal,
  Form
} from 'semantic-ui-react'
import {isEqual} from 'lodash';

import '../../containers/App.css';

const initialState = {
  csv: '',
  csvError: false,
  csvPlaceHolder: 'CSV string from pattern'
};

class PasteCsvModal extends Component {

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

  csvChangedHandler = (event) => {
    this.setState({
      csv: event.target.value,
      csvError: false,
      csvPlaceHolder: 'CSV string from pattern'
    })
  };


  cancelAction = () => {
    this.props.closeAction("cancelled");
  };

  okAction = () => {
    if (!this.state.csv) {
      this.setState({
        csvError: true,
        csvPlaceHolder: 'CSV string is required'
      });
      return;
    }
    this.props.closeAction("ok", this.state.csv);
  };



  render() {
    const formFieldStyle = {
      width: '300px'
    };

    return (
        <Modal size='tiny' dimmer='inverted' open={this.props.visible}
               centered={true}>
          <Modal.Header>Paste CSV String from Pattern</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input fluid
                          label='CSV String'
                          placeholder={this.state.csvPlaceHolder}
                          style={formFieldStyle}
                          onChange={(event) => this.csvChangedHandler(
                              event)}
                          value={this.state.csv}
                          required
                          error={this.state.csvError}
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
                content="Paste"
                onClick={this.okAction}
            />
          </Modal.Actions>
        </Modal>
    )
  }
}

export default PasteCsvModal;
