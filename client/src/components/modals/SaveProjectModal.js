import React, {Component} from 'react';
import {
  Button,
  Modal,
  Progress
} from 'semantic-ui-react'
import _ from 'lodash';

import '../../containers/App.css';

const parseFetchResponse = response =>
    response.text()
    .then(text => {
      let json = null;
      try {
        let json = JSON.parse(text);
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
  saveStatus: null,
  okButtonDisabled: true,
  dialogHeader: "Saving Project",
  progressMessage: "Saving...",
  progressBarActive: true,
  progressBarPercent: 100,
  progressBarSuccess: false,
  progressBarError: false,
  buttonPositive: false,
  buttonIcon: null
};

class SaveProjectModal extends Component {

  state = {
    ...initialState
  };

  static getDerivedStateFromProps(props, state) {
    if (!props.visible && !_.isEqual(state, initialState)) {
      return {
        ...initialState
      };
    }
    // Return null to indicate no change to state.
    return null;
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.visible && !prevProps.visible) {
      this.saveProject();
    }
  }

  saveProject = () => {
    if (!this.props.projectId ||
        !this.props.knitgrids ||
        !this.props.selectedCellIds) {
      this.setState({
        dialogHeader: "No current project to save",
        progressMessage: "Not saving",
        okButtonDisabled: false,
        progressBarActive: false,
        progressBarPercent: 0
      });
      return;
    }

    const knitgrids = _.cloneDeep(this.props.knitgrids);
    const selectedCellIds = _.cloneDeep(this.props.selectedCellIds);

    let knitgridIndex = 0;
    for (let knitgrid of knitgrids) {
      for (let row of knitgrid.grid) {
        for (let cell of row.cells) {
          cell.selected = cell.id === selectedCellIds[knitgridIndex];
        }
      }
      knitgridIndex++;
    }

    fetch('/api/projects/' + this.props.projectId, {
      method: 'POST',
      body: JSON.stringify({
        knitgrids: knitgrids
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
        this.setState({
          dialogHeader: "Error saving project",
          progressMessage: errorMessage,
          okButtonDisabled: false,
          progressBarError: true
        });
        return;
      }
      this.props.projectSaved(knitgrids);
      this.setState({
        dialogHeader: "Project saved",
        progressMessage: "Success!",
        okButtonDisabled: false,
        progressBarSuccess: true,
        buttonPositive: true,
        buttonIcon: "checkmark"
      });
    })
    .catch(error => {
      console.error('Error:', error.message);
      this.setState({
        dialogHeader: "Error saving project",
        progressMessage: "Error: " + error.message,
        okButtonDisabled: false,
        progressBarError: true
      });
    });

  };

  okAction = () => {
    this.props.closedAction(this.state.saveStatus);
  };

  render() {
    const progressStyle = {
      width: '300px'
    };

    const modalContentStyle = {
      display: 'block',
      overflow: 'auto'
    };

    return (
        <Modal size='tiny' dimmer='inverted' open={this.props.visible}
               centered={true}>
          <Modal.Header>{this.state.dialogHeader}</Modal.Header>
          <Modal.Content style={modalContentStyle}>
            <Progress percent={this.state.progressBarPercent}
                      active={this.state.progressBarActive}
                      success={this.state.progressBarSuccess}
                      error={this.state.progressBarError}
                      style={progressStyle}>
              <div >
                {this.state.progressMessage}
              </div>
            </Progress>
          </Modal.Content>
          <Modal.Actions>
            <Button
                positive={this.state.buttonPositive}
                icon={this.state.buttonIcon}
                labelPosition='right'
                content="Close"
                onClick={this.okAction}
                disabled={this.state.okButtonDisabled}
            />
          </Modal.Actions>
        </Modal>
    )
  }
}

export default SaveProjectModal;
