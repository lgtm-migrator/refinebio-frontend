import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import Loader from '../../components/Loader';
import { fetchExperiment } from '../../state/experiment/actions';
import Button from '../../components/Button';
import { getQueryParamObject, formatSentenceCase } from '../../common/helpers';
import './Experiment.scss';

import AccessionIcon from '../../common/icons/accession.svg';
import SampleIcon from '../../common/icons/sample.svg';
import OrganismIcon from '../../common/icons/organism.svg';
import BackToTop from '../../components/BackToTop';

import SamplesTable from './SamplesTable';
import {
  addExperiment,
  removeExperiment,
  removeSamples
} from '../../state/download/actions';
import DataSetSampleActions from './DataSetSampleActions';
import Checkbox from '../../components/Checkbox';
import { goBack } from '../../state/routerActions';
import DataSetStats from './DataSetStats';
import TechnologyBadge, {
  MICROARRAY,
  RNA_SEQ
} from '../../components/TechnologyBadge';

let Experiment = ({
  fetchExperiment,
  experiment,
  addExperiment,
  removeExperiment,
  removeSamples,
  addSamplesToDataset,
  dataSet,
  match,
  location: { search },
  goBack
}) => {
  // check for the parameter `ref=search` to ensure that the previous page was the search
  const comesFromSearch = getQueryParamObject(search)['ref'] === 'search';
  const { organisms = [] } = experiment;

  return (
    <Loader fetch={() => fetchExperiment(match.params.id)}>
      {({ isLoading }) =>
        isLoading ? (
          <div className="loader" />
        ) : (
          <div>
            {comesFromSearch && (
              <Button
                text="Back to Results"
                buttonStyle="secondary"
                onClick={goBack}
              />
            )}

            <div className="experiment">
              <Helmet>
                <title>refine.bio - Experiment Details</title>
              </Helmet>
              <BackToTop />
              <div className="experiment__accession">
                <img
                  src={AccessionIcon}
                  className="experiment__stats-icon"
                  alt="Accession Icon"
                />
                {experiment.accession_code}
              </div>

              <div className="experiment__header">
                <h3 className="experiment__header-title mobile-p">
                  {experiment.title || 'No Title.'}
                </h3>
                <div>
                  <DataSetSampleActions
                    data={{
                      [experiment.accession_code]: experiment.samples
                    }}
                  />
                </div>
              </div>

              <div className="experiment__stats">
                <div className="experiment__stats-item">
                  <img
                    src={OrganismIcon}
                    className="experiment__stats-icon"
                    alt="Organism Icon"
                  />{' '}
                  {organisms.length
                    ? organisms
                        .map(organism => formatSentenceCase(organism.name))
                        .join(',')
                    : 'No species.'}
                </div>
                <div className="experiment__stats-item">
                  <img
                    src={SampleIcon}
                    className="experiment__stats-icon"
                    alt="Sample Icon"
                  />{' '}
                  {experiment.samples.length
                    ? `${experiment.samples.length} Sample${
                        experiment.samples.length > 1 ? 's' : null
                      }`
                    : null}
                </div>
                <div className="experiment__stats-item">
                  <TechnologyBadge
                    className="experiment__stats-icon"
                    isMicroarray={experiment.samples.some(
                      x => x.technology === MICROARRAY
                    )}
                    isRnaSeq={experiment.samples.some(
                      x => x.technology === RNA_SEQ
                    )}
                  />
                  {experiment.samples.length
                    ? experiment.samples[0].pretty_platform
                    : null}
                </div>
              </div>

              <h4 className="experiment__title">
                Submitter Supplied Information
              </h4>

              <div>
                <div className="experiment__row">
                  <div className="experiment__row-label">Description</div>
                  <div>{experiment.description}</div>
                </div>
                <div className="experiment__row">
                  <div className="experiment__row-label">PubMed ID</div>
                  <div>
                    {(experiment.pubmed_id && (
                      <a
                        href={`https://www.ncbi.nlm.nih.gov/pubmed/${
                          experiment.pubmed_id
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link"
                      >
                        {experiment.pubmed_id}
                      </a>
                    )) || (
                      <i className="experiment__not-provided">
                        No associated PubMed ID
                      </i>
                    )}
                  </div>
                </div>
                <div className="experiment__row">
                  <div className="experiment__row-label">Publication Title</div>
                  <div>
                    {(experiment.publication_title && (
                      <a
                        href={`https://www.ncbi.nlm.nih.gov/pubmed/${
                          experiment.pubmed_id
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link"
                      >
                        {experiment.publication_title}
                      </a>
                    )) || (
                      <i className="experiment__not-provided">
                        No associated publication
                      </i>
                    )}
                  </div>
                </div>
                <div className="experiment__row">
                  <div className="experiment__row-label">
                    Submitter’s Institution
                  </div>
                  <div>
                    <a
                      href={`/results?q=${encodeURIComponent(
                        experiment.submitter_institution
                      )}`}
                      rel="noopener noreferrer"
                      className="link"
                    >
                      {experiment.submitter_institution}
                    </a>
                  </div>
                </div>
                <div className="experiment__row">
                  <div className="experiment__row-label">Authors</div>
                  <div>
                    {experiment.publication_authors.length > 0 ? (
                      experiment.publication_authors
                        .map(author => (
                          <a
                            href={`/results?q=${encodeURIComponent(author)}`}
                            rel="noopener noreferrer"
                            className="link"
                          >
                            {author}
                          </a>
                        ))
                        .reduce((previous, current) => (
                          <React.Fragment>
                            {previous}
                            {', '}
                            {current}
                          </React.Fragment>
                        ))
                    ) : (
                      <i className="experiment__not-provided">
                        No associated authors
                      </i>
                    )}
                  </div>
                </div>
              </div>
              <section className="experiment__section" id="samples">
                <h2 className="experiment__title">Samples</h2>
                <ExperimentSamplesTable experiment={experiment} />
              </section>
            </div>
          </div>
        )
      }
    </Loader>
  );
};
Experiment = connect(
  ({ experiment, download: { dataSet } }) => ({ experiment, dataSet }),
  {
    fetchExperiment,
    addExperiment,
    removeExperiment,
    removeSamples,
    goBack
  }
)(Experiment);

export default Experiment;

class ExperimentSamplesTable extends React.Component {
  state = {
    showOnlyAddedSamples: false,
    onlyAddedSamples: []
  };

  render() {
    const { experiment } = this.props;

    return (
      <SamplesTable
        accessionCodes={this._getSamplesToBeDisplayed()}
        experimentAccessionCodes={[experiment.accession_code]}
        // Render prop for the button that adds the samples to the dataset
        pageActionComponent={samplesDisplayed => (
          <div className="experiment__sample-actions">
            <div className="mobile-p">
              <Checkbox
                name="samples-dataset"
                checked={this.state.showOnlyAddedSamples}
                onToggle={() =>
                  this.setState({
                    showOnlyAddedSamples: !this.state.showOnlyAddedSamples,
                    onlyAddedSamples: this._getAddedSamples()
                  })
                }
                disabled={
                  !this.state.showOnlyAddedSamples &&
                  !this._anySampleInDataSet()
                }
              >
                Show only samples added to dataset
              </Checkbox>
            </div>

            <DataSetSampleActions
              data={{
                [experiment.accession_code]: samplesDisplayed
              }}
              enableAddRemaining={false}
              meta={{
                buttonStyle: 'secondary',
                addText: 'Add Page to Dataset'
              }}
            />
          </div>
        )}
      />
    );
  }

  _anySampleInDataSet() {
    const { experiment, dataSet } = this.props;
    return new DataSetStats(
      dataSet,
      experiment.samples
    ).anyProcessedInDataSet();
  }

  _getAddedSamples() {
    const { experiment, dataSet } = this.props;

    // show only the samples that are present in the dataset
    return new DataSetStats(dataSet, experiment.samples)
      .getSamplesInDataSet()
      .map(x => x.accession_code);
  }

  _getSamplesToBeDisplayed() {
    if (this.state.showOnlyAddedSamples) {
      // show only the samples that are present in the dataset
      return this.state.onlyAddedSamples;
    }

    // return the accession codes of all samples
    return this.props.experiment.samples.map(x => x.accession_code);
  }
}
ExperimentSamplesTable = connect(({ download: { dataSet } }) => ({ dataSet }))(
  ExperimentSamplesTable
);
