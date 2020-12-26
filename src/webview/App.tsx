/* eslint-disable @typescript-eslint/naming-convention */

import React, { FC } from 'react';
import styles from './app.module.scss';

export const App: FC<{}> = () => {
	return <span className={styles.helloText}>Hello VStats</span>;
};