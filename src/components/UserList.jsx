import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import PeopleList from "components/PeopleList";
import AttendeeListItem from "components/EventPage/AttendeeListItem";

export default class UserList extends React.Component {

  static defaultProps = {
    title: "People",
    isTitlePlural: true,
  };

  static propTypes = {
    isTitlePlural: PropTypes.bool,
    title: PropTypes.string.isRequired,
    users: PropTypes.array.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
  };

  static defaultProps = {
    className: "",
    style: {},
  };

  constructor() {
    super();
    autoBind(this);
  }

  render() {
    const { users, title, style, className, isTitlePlural } = this.props;
    const items = [];
    users.forEach(item => {
      items.push(<AttendeeListItem
        key={items.length}
        user={item}
        userId={item && item.uid}
        name={item && item.name}
        location={user.location || "San Jose, CA"}
        image={item && item.photo}
      />);
    });

    return <PeopleList
      style={style}
      className={className}
      people={items}
      peopleType={title}
      isTitlePlural={isTitlePlural}
    />;
  }
}
