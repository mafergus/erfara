import React, { PropTypes } from "react";
import autoBind from "react-autobind";
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
    return <PeopleList people={items} peopleType={title} style={style} />
  }
  
}
