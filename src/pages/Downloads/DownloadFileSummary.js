import React from 'react';
import InfoIcon from '../../common/icons/info-badge.svg';

import {
  downloadsFilesDataBySpecies,
  downloadsFilesDataByExperiment,
} from './downloadFilesData';

const DownloadFileSummary = ({ dataSet, samplesBySpecies, aggregate_by }) => {
  if (!dataSet) return null;

  const summaryData =
    aggregate_by === 'SPECIES'
      ? downloadsFilesDataBySpecies(dataSet, samplesBySpecies)
      : downloadsFilesDataByExperiment(dataSet);

  return (
    <section className="downloads__section">
      <div className="downloads__cards">
        {summaryData.files.map(card => (
          <div className="downloads__card" key={card.title + card.description}>
            <h4>{card.title}</h4>
            <div className="downloads__card-stats">
              <div className="downloads__card-stat">{card.description}</div>
              <div className="downloads__card-stat">Format: {card.format}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="downloads-processed-info info">
        <img className="info__icon" src={InfoIcon} alt="" />
        <div>
          <div className="nowrap">
            All data you download from refine.bio has been uniformly processed
            and normalized.{' '}
            <a
              href="//docs.refine.bio/en/latest/main_text.html#processing-information"
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadFileSummary;
