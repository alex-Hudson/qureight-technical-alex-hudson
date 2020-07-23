// frontend/src/App.js

import React, { Component } from "react";
import Nav from "./components/Nav";
import axios from "axios";
import LoginForm from "./components/LoginForm";
import {
  LeftCircleOutlined,
  RightCircleOutlined,
  ReadOutlined,
  BulbOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { getCookie } from "./NetworkUtils";
import { getAgeFromDateString, parseString } from "./StringUtils";

class App extends Component {
  constructor(props) {
    super(props);
    this.requiresLogin = true;
    this.isMobile = window.innerWidth > 600 ? false : true;
    this.state = {
      viewCompleted: false,
      activeItem: {
        title: "",
        description: "",
        completed: false,
        reading_date: "",
      },
      people: [],
      displayed_form: "",
      logged_in:
        localStorage.getItem("token") || !this.requiresLogin ? true : false,
      username: "",
    };
    this.baseUrl = window.location.protocol + "//" + window.location.host;
  }

  componentDidMount() {
    if (this.state.logged_in) {
      if (this.requiresLogin) {
        fetch(`${this.baseUrl}/current_user/`, {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        })
          .then((res) => res.json())
          .then((json) => {
            this.setState({ username: json.username });
            this.refreshList();
          });
      } else {
        this.refreshList();
      }
    }
  }

  handleLogin = (e, data) => {
    const csrfCookie = getCookie("csrftoken");
    this.setState({ loginError: false });
    e.preventDefault();
    fetch(`${this.baseUrl}/token-auth/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFTOKEN": csrfCookie,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((json) => {
        localStorage.setItem("token", json.token);
        this.setState({
          logged_in: true,
          displayed_form: "",
          username: json.user.username,
        });
        this.refreshList();
      })
      .catch((error) => {
        this.setState({
          loginError: true,
          logged_in: this.requiresLogin || true,
          username: null,
          displayed_form: "login",
          currentItem: null,
        });
        localStorage.removeItem("token");
      });
  };

  handle_logout = () => {
    localStorage.removeItem("token");
    this.setState({ logged_in: this.requiresLogin || false, username: "" });
  };

  display_form = (form) => {
    this.setState({
      displayed_form: form,
    });
  };

  renderLoginError() {
    return <div className="login-failed">Incorrect username or password</div>;
  }

  /**
   * Gets all reading Items in database
   */
  refreshList = () => {
    axios
      .get(`${this.baseUrl}/api/people/`, {
        headers: {
          "Content-type": "application/json",
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const people = res.data;
        this.setState({ people: this.sortDyName(people) });
        this.setState({ currentItem: people[0] });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          loginError: true,
          logged_in: this.requiresLogin || false,
          username: null,
          displayed_form: "login",
          currentItem: null,
        });
        localStorage.removeItem("token");
      });
  };

  /**
   *
   */
  sortDyName(people) {
    const sortedPeople = people.sort((a, b) => {
      const nameA = a.name;
      const nameB = b.name;
      return nameA - nameB;
    });
    return sortedPeople;
  }

  /**
   * Sets state to clicked item in the list
   * @param {Object} item
   */
  handleSidebarItemClick(item) {
    this.setState({ currentItem: item });
  }

  /**
   * Displays list of items
   */
  renderItems = () => {
    const item = this.state.currentItem;
    if (!item) return null;
    return (
      <div className={"items"} key={item.id}>
        {this.createCircleIcon(
          <ReadOutlined
            style={{ fontSize: "30px", color: "#13395c" }}
            className={"circle-icon-logo"}
          />,
          "Height"
        )}
        {parseString(item.height, "reading-item")}
        {this.createCircleIcon(
          <BulbOutlined
            style={{ fontSize: "30px", color: "#13395c" }}
            className={"circle-icon-logo"}
          />,
          "Age"
        )}
        {parseString(getAgeFromDateString(item.age), "reading-item")}
        {this.createCircleIcon(
          <MessageOutlined
            style={{ fontSize: "30px", color: "#13395c" }}
            className={"circle-icon-logo"}
          />,
          "Notes"
        )}
        {parseString(item.notes, "reading-item prayer-text")}
        {this.isMobile ? (
          <div className={"page-footer"}>
            <div className={"day-by-day-title"}>Day By Day</div>
          </div>
        ) : null}
      </div>
    );
  };

  createCircleIcon(icon, text) {
    return (
      <div className={"header-dot"}>
        {icon}
        <div className={"header-text"}>{text}</div>
      </div>
    );
  }

  renderSidebar() {
    const items = this.state.people;
    if (!items) return null;
    return items.map((item) => (
      <li
        key={item.id}
        className="sidebar-item"
        value={item.id}
        onClick={() => {
          this.handleSidebarItemClick(item);
        }}
      >
        <span className={`siderbar-title`}>
          {item.name}
          <p>{getAgeFromDateString(item.age)}</p>
        </span>
      </li>
    ));
  }

  renderApp() {
    if (!this.state.currentItem) return null;

    return (
      <div style={{ minHeight: "100vh", position: "relative" }}>
        <div className={"arrow-container"}>
          <div className={"back-button"} onClick={this.backwardClick}>
            <LeftCircleOutlined style={{ fontSize: "25px" }} />
          </div>
          <div className="page-title">{this.state.currentItem.name}</div>
          <div className={"forward-button"} onClick={this.forwardClick}>
            <RightCircleOutlined style={{ fontSize: "25px" }} />
          </div>
        </div>
        <div className={"sidebar-list-container"}>
          <ul className="sidebar-list">{this.renderSidebar()}</ul>
        </div>
        <ul className="list-group list-group-flush">{this.renderItems()}</ul>
      </div>
    );
  }

  /**
   * Renders main page
   */
  render() {
    const form = this.state.logged_in ? null : (
      <LoginForm handle_login={this.handleLogin} />
    );
    const loginErrorMsg = this.state.loginError
      ? this.renderLoginError()
      : null;

    return (
      <div className="App">
        {!this.isMobile ? (
          <div className={"page-header"}>
            {/* <img
              className={"logo"}
              src={logo}
              alt="lym-logo"
              onClick={this.handleLogoClick}
            /> */}
          </div>
        ) : null}
        {this.requiresLogin ? (
          <Nav
            logged_in={this.state.logged_in}
            display_form={this.display_form}
            handle_logout={this.handle_logout}
          />
        ) : null}

        {form}
        {loginErrorMsg}
        {this.state.logged_in ? this.renderApp() : null}
      </div>
    );
  }

  /**
   * Formats date from server into human readable
   * @param {string} dateString
   */
  formatDate(dateString) {
    if (!dateString) return null;
    const d = new Date(dateString);
    const formattedDateString = d.toLocaleDateString("en-UK", {
      weekday: "long",
      month: window.innerWidth > 600 ? "long" : "short",
      day: "numeric",
    });

    return formattedDateString;
  }

  forwardClick = (e) => {
    const currentIndex = this.state.people.findIndex(
      (item) => item.id === this.state.currentItem.id
    );
    this.setState({
      currentItem:
        this.state.people[currentIndex - 1] || this.state.currentItem,
    });
  };

  backwardClick = (e) => {
    const currentIndex = this.state.people.findIndex(
      (item) => item.id === this.state.currentItem.id
    );
    this.setState({
      currentItem:
        this.state.people[currentIndex + 1] || this.state.currentItem,
    });
  };
}
export default App;
