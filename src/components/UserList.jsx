import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import AttendeeListItem from "./EventPage/AttendeeListItem";
import { darkBlack, faintBlack } from "material-ui/styles/colors";
import PeopleList from "./PeopleList";

export default class UserList extends React.Component {

  static defaultProps = {
    title: "People",
  };

  static propTypes = {
    title: PropTypes.string.isRequired,
    users: PropTypes.array,
    style: PropTypes.object,
  };

  constructor() {
    super();
    autoBind(this);
  }

  render() {
    const { users, title } = this.props;
    const style = {
      ...this.props.style,
      padding: "0 0 0 0",
      border: `1px solid ${faintBlack}`,
      borderRadius: "1%",
    }
    let items = [];
    users && users.forEach(item => {
      items.push(<AttendeeListItem
        key={items.length}
        user={item}
        userId={item.uid}
        name={item.name}
        location="San Jose, CA" 
        image={item.photo}
        />);
    });
    return <PeopleList people={items} peopleType={title} style={this.props.style} />
  }
  
}
