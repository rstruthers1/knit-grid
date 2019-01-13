import React, {Component} from 'react';
import {List} from 'semantic-ui-react';

class ProjectKnitGridList extends Component {
  handleClick = (event, data) => {
    this.props.onSelectNode(data.id);
  };

  render() {
    if (!this.props.projectTreeData) {
      return <div>No Open Projects</div>
    }

    const parentNode = this.props.projectTreeData[0];

    let listItems = null;
    if (parentNode.children) {
      listItems = parentNode.children.map(knitgridItem => {
        return (
            <List.Item value={knitgridItem.key + ""}
                       key={knitgridItem.key + ""}
                       id={knitgridItem.key}
                       onClick={(event, data) => this.handleClick(event, data)}
                       active={knitgridItem.key === this.props.selectedKnitgridId}>
              <List.Icon name='file'/>
              <List.Content>
                <List.Header as='a'>{knitgridItem.title}</List.Header>
              </List.Content>
            </List.Item>
        )
      })
    }

    return (
        <List>
          <List.Item>
            <List.Icon name='folder'/>
            <List.Content>
              <List.Header>{parentNode.title}</List.Header>
              <List selection>
                {listItems}
              </List>
            </List.Content>
          </List.Item>
        </List>
    )
  }
}

export default ProjectKnitGridList;
