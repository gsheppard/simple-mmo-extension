import React from 'react';
import cx from 'classnames';
import styles from './style.scss';

const App = () => (
  <div className={cx('kt-container', styles.superDuper)}>
    <div className="kt-portlet d-none d-lg-block">
      <div className="kt-portlet__body  kt-portlet__body--fit">
        <h1>Hello World</h1>
      </div>
    </div>
  </div>
);

export default App;
