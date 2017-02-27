import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { faintBlack } from "material-ui/styles/colors";
import PeopleList from "components/PeopleList";
import AttendeeListItem from "components/EventPage/AttendeeListItem";

export default class UserList extends React.Component {

  static defaultProps = {
    title: "People",
  };

  static propTypes = {
    title: PropTypes.string.isRequired,
    users: PropTypes.any,
    style: PropTypes.object,
  };

  constructor() {
    super();
    autoBind(this);
  }

  render() {
    const { users, title, style } = this.props;
    const STYLE = {
      ...style,
      padding: "0 0 0 0",
      border: `1px solid ${faintBlack}`,
      borderRadius: "1%",
    }
    let items = [];
    users && users.forEach(item => {
      items.push(<AttendeeListItem
        key={items.length}
        user={item}
        userId={item && item.uid}
        name={item && item.name}
        location="San Jose, CA" 
        image={item && item.photo}
        />);
    });
    return <PeopleList people={items} peopleType={title} style={STYLE} />
  }
  
}
