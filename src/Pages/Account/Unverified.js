import React from 'react'
import { connect } from 'react-redux';
import { Alert } from 'reactstrap'
import { compose } from 'redux';
import { getAuthUserAll } from '../../services/auth';
import { sendFetchAccountData } from '../../store/actions/user';

class Unverified extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    }
    this.fileRef = React.createRef();
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  handleFileChange(e) {
    let formData = new FormData();
    formData.append('request', 'document_upload');
    formData.append('file', e.target.files[0]);
    formData.append('data', encodeURIComponent(JSON.stringify({
      ...getAuthUserAll(),
      document: e.target.id
    })));
    this.props.sendFetchData(formData);
  }

  render() {
    if (this.props.data !== undefined || this.props.data !== '') {
      return (
        <Alert color="danger" style={{ textAlign: "center", marginBottom: "2em" }}>
          {this.props.data}
        </Alert>
      )
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    sendFetchData: (data) => dispatch(sendFetchAccountData(data))
  };
};


export default compose(
  connect(null, mapDispatchToProps)
)(Unverified);
