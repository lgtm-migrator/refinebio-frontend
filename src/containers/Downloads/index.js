import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  removeExperiment,
  removeSpecies,
  fetchDataSetDetails
} from '../../state/download/actions';
import {
  groupSamplesBySpecies,
  getTotalSamplesAdded,
  getExperimentCountBySpecies,
  getTotalExperimentsAdded
} from '../../state/download/reducer';

import DownloadBar from './DownloadBar';
import DownloadDetails from './DownloadDetails';
import './Downloads.scss';
import downloadsFilesData from './downloadFilesData';

class Download extends Component {
  componentDidMount() {
    const { dataSet, dataSetId, fetchDataSetDetails } = this.props;
    if (dataSetId) fetchDataSetDetails(dataSet);
  }

  componentDidUpdate() {
    const {
      dataSet,
      dataSetId,
      areDetailsFetched,
      fetchDataSetDetails,
      isLoading
    } = this.props;

    if (dataSetId && !areDetailsFetched && !isLoading) {
      fetchDataSetDetails(dataSet);
    }
  }

  render() {
    const { dataSetId, isLoading, areDetailsFetched } = this.props;

    return (
      <div className="downloads">
        <h1 className="downloads__heading">Download Dataset</h1>
        <DownloadBar dataSetId={dataSetId} />

        {isLoading && !areDetailsFetched ? (
          <div className="loader" />
        ) : (
          <DownloadDetails {...this.props} />
        )}
      </div>
    );
  }
}
Download = connect(
  ({
    download: {
      dataSetId,
      isLoading,
      areDetailsFetched,
      samples,
      dataSet,
      experiments
    }
  }) => ({
    dataSetId,
    isLoading,
    areDetailsFetched,
    samples,
    dataSet,
    experiments,
    samplesBySpecies: groupSamplesBySpecies({
      samples: samples,
      dataSet: dataSet
    }),
    filesData: downloadsFilesData(dataSet),
    totalSamples: getTotalSamplesAdded({ dataSet }),
    totalExperiments: getTotalExperimentsAdded({ dataSet }),
    experimentCountBySpecies: getExperimentCountBySpecies({
      experiments,
      dataSet
    })
  }),
  {
    removeSpecies,
    removeExperiment,
    fetchDataSetDetails
  }
)(Download);

export default Download;
