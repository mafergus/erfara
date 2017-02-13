const DEV_USER = {
  "uid": "8hJGDkRieEfhPiMnu1HGDF8w59V2",
  "coverImage" : "http://www.imgnaly.com/wp-content/uploads/2015/07/City-Sky-Line-Fb-Cover.png",
  "email" : "matthew.n.ferguson@gmail.com",
  "events" : {
    "-Kb9W5YcLs1no9huyv4H" : {
      "date" : "2017-01-23T08:43:08.366Z",
      "description" : "asfasdasd",
      "title" : "adasd",
      "userId" : "7hJGDkRieEfhPiMnu1HGDF8w59V2"
    }
  },
  "followers" : {
    "12asda" : "8hJGDkRieEfhPiMnu1HGDF8w59V2",
    "asdas" : "7hJGDkRieEfhPiMnu1HGDF8w89V2",
    "mlka3p12" : "9hJGDkRieEfhPiMnu1HGDF8w59V2"
  },
  "name" : "Matt Ferguson",
  "photo" : "https://scontent.xx.fbcdn.net/v/t1.0-1/p100x100/11009152_10105063465546270_5215382255678934863_n.jpg?oh=185a667a757d3d5f38824901c1c1d3ab&oe=5923891C",
  "wall" : {
    "123asd" : {
      "from" : "9hJGDkRieEfhPiMnu1HGDF8w59V2",
      "message" : "This is a test this is only a test of the wall!!",
      "timestamp" : "2017-01-23T08:43:08.366Z"
    },
    "asdxvsad" : {
      "from" : "8hJGDkRieEfhPiMnu1HGDF8w59V2",
      "message" : "Hey dude so cool meeting you the other day!!",
      "timestamp" : "2017-01-22T08:43:08.366Z"
    }
  }
};

export function authedUserReducer(state = {}, action) {
  switch (action.type) {
    case "ADD_AUTHED_USER_SUCCESS": {
      return action.user;
    }
    case "SIGN_OUT_USER": {
      return {};
    }
    default:
      return state;
  }
}
