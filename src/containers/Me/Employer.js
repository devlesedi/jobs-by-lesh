// import * as adminMenuActions from 'actions/admin-menu';

import Component from 'components/component';
import React, {PropTypes} from 'react';

import Menu from './components/menu';

export default class EmployerMenuContainer extends Component {
  static propTypes = {
    closeAdminMenu: PropTypes.func.isRequired,
    openAdminMenu: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired
  };

  componentDidMount() {
    this.props.openAdminMenu();
  }

  onBack() {
    this.props.closeAdminMenu();
  }

  render() {
    const {pathname} = this.props;
    return (
      <Menu
        onBack={this.onBack.bind(this)}
        pathname={pathname}
      />
    );
  }
}
