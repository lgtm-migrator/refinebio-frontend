import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import logo from '../../common/icons/logo.svg';
import { fetchDataSet } from '../../state/download/actions';
import { getTotalSamplesAdded } from '../../state/download/reducer';
import { withRouter } from 'react-router';
import './Header.scss';

class Header extends React.Component {
  componentDidMount() {
    this.props.fetchDataSet();
  }

  render() {
    const { location: { pathname } } = this.props;

    return (
      <header
        className={`header js-header ${pathname === '/' && 'header--main'}`}
      >
        <div className="header__container">
          <div className="header__logo">
            <Link to="/">
              <img src={logo} alt="refine.bio" />
            </Link>
          </div>
          <div>
            <Link className="header__link" to="/">
              Search
            </Link>
            <Link className="header__link" to="/api">
              API
            </Link>
            <Link className="header__link" to="/docs">
              Docs
            </Link>
            <Link className="header__link" to="/about">
              About
            </Link>
            <Link className="header__link header__link--button" to="/download">
              Download Dataset
              {this.props.isLoading ? null : (
                <div className="header__dataset-count">
                  {this.props.totalSamples}
                </div>
              )}
            </Link>
          </div>
        </div>
      </header>
    );
  }
}

function mapStateToProps({ download: { dataSet, isLoading } }) {
  return {
    totalSamples: getTotalSamplesAdded({ dataSet }),
    isLoading
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchDataSet }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
