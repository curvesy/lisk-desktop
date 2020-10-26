import React, { useState } from 'react';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import { PrimaryButton } from '../../../toolbox/buttons';
import ProgressBar from '../progressBar';
import styles from './styles.css';

const ImportData = ({ t, nextStep }) => {
  const [jsonInput, setJsonInput] = useState(undefined);
  const reader = new FileReader();

  reader.onload = ({ target }) => {
    const parsedInput = JSON.parse(target.result);
    setJsonInput(parsedInput);
  };

  const onFileInputChange = (evt) => {
    reader.readAsText(evt.target.files[0]);
  };

  const handleDrop = (evt) => {
    reader.readAsText(evt.dataTransfer.files[0]);
  };

  const onReview = () => {
    nextStep({ members: jsonInput });
  };

  return (
    <section>
      <Box className={styles.container}>
        <header>
          <h1>{t('Sign multisignature transaction')}</h1>
          <p>{t('If you have received a multisignature transaction that requires your signature, use this tool to review and sign it.')}</p>
        </header>
        <BoxContent>
          <ProgressBar current={1} />
          <p>
            {t('Paste transaction value')}
            <label className={styles.fileInputBtn}>
              {t('Read from JSON file')}
              <input
                className={styles.input}
                type="file"
                onChange={onFileInputChange}
              />
            </label>
          </p>
          <label className={styles.dropFileArea}>
            <input
              type="file"
              onChange={onFileInputChange}
              onDrop={handleDrop}
            />
          </label>
        </BoxContent>
        <BoxFooter className={styles.footer}>
          <PrimaryButton
            className="confirm-button"
            size="l"
            onClick={onReview}
            disabled={!jsonInput}
          >
            {t('Review and Sign')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    </section>
  );
};

export default ImportData;
